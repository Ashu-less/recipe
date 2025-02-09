//sign in  and sign up, front end for home and default food preferences )(the sections on the front of the homepage-> like picking vegetarian foods and whatnot) 
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const session = require('express-session');

const app = express();
const port = 8000; 

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    password: '',  
    database: 'recinsta',
    //port: '8000'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL Connected');
});
db.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Database connection was closed.');
    } else {
        throw err;
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res, next) => {
    console.log('Incoming request:', {
        method: req.method,
        path: req.path,
        body: req.body,
        headers: req.headers
    });
    next();
});

app.post('/signup', async (req, res) => {
    console.log('Signup endpoint hit!');
    
    const { username, password, firstName, lastName, email, preference } = req.body;
    
    
    console.log('Values being inserted:', { username, password, firstName, lastName, email, preference });
    
    const sql = 'INSERT INTO users (username, password, email, first_name, last_name, preference) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [username, password, email, firstName, lastName, preference];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                error: 'Error saving user in database',
                details: err.message 
            });
        }
        
        console.log('Database insert successful:', result);
        return res.status(201).json({ 
            message: 'User registered successfully',
            userId: result.insertId 
        });
    });
});

app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    
    console.log('Attempting to sign in with:', { username, password });

    const sql = 'SELECT user_id, username FROM users WHERE username = ? AND password = ?';
    console.log('SQL:', sql, 'Params:', [username, password]);

    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.length > 0) {
            res.status(200).json({ 
                message: 'Login successful', 
                userId: result[0].user_id
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

app.post('/signout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.sendStatus(200);
    });
});

app.post('/like/:recipeId', (req, res) => {
    const recipeId = req.params.recipeId;
    console.log('Recipe ID:', recipeId);
    const sql = 'UPDATE recipes SET likes = likes + 1 WHERE recipe_id = ?';

    db.query(sql, [recipeId], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error updating likes' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        db.query('SELECT likes FROM recipes WHERE recipe_id = ?', [recipeId], (err, rows) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Error fetching updated likes' });
            }

            res.status(200).json({ 
                message: 'Like added successfully', 
                likes: rows[0].likes 
            });
        });
    });
});

app.post('/comment/:recipeId', (req, res) => {
    const recipeId = req.params.recipeId;
    const { user_id, comment_text } = req.body;

    if (!user_id || !comment_text) {
        return res.status(400).json({ error: 'User ID and comment text are required' });
    }

    console.log('Received comment:', { recipeId, user_id, comment_text });

    const sql = 'INSERT INTO comments (recipe_id, user_id, comment) VALUES (?, ?, ?)';
    db.query(sql, [recipeId, user_id, comment_text], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error saving comment' });
        }

        res.status(201).json({
            message: 'Comment added successfully',
            comment_id: result.insertId,
        });
    });
});

app.get('/comments/:recipeId', (req, res) => {
    const recipeId = req.params.recipeId;

    const sql = `
        SELECT c.comment_id, c.comment, c.created_at, u.username 
        FROM comments c
        JOIN users u ON c.user_id = u.user_id
        WHERE c.recipe_id = ?
        ORDER BY c.created_at DESC
    `;

    db.query(sql, [recipeId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error fetching comments' });
        }

        res.json(results);
    });
});

app.get('/recipes', (req, res) => {
    const sql = 'SELECT recipe_id, dishName, steps, dishType, likes FROM recipes';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching recipes' });
        }
        res.json(results);
    });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/images/'));
    },
    filename: (req, file, cb) => {
        let dishName = req.body.dishName.replace(/[^a-zA-Z0-9]/g, "_"); 
        let fileExt = path.extname(file.originalname);
        cb(null, dishName + fileExt);
    }
});

const upload = multer({ storage: storage });

app.post('/create-recipe', upload.single('recipeImage'), (req, res) => {
    const { dishName, steps, dishType } = req.body;
    let imagePath = null;

    if (req.file) {
        const tempPath = req.file.path;
        imagePath = `/images/${req.file.filename}`;

        const targetPath = path.join(__dirname, 'public/images', req.file.filename);
        fs.rename(tempPath, targetPath, (err) => {
            if (err) {
                console.error('Error moving file:', err);
                return res.status(500).json({ error: 'Error saving image' });
            }
        });
    }
    

    console.log('Received recipe data:', { dishName, steps, dishType, imagePath });

    const sql = 'INSERT INTO recipes (dishName, steps, dishType, likes) VALUES (?, ?, ?, ?)';
    const values = [dishName, steps, dishType, 0];

    db.query(sql, values, (err, result) => {
        console.log("recipes recieved to db");
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error saving recipe' });
        }

        res.status(201).json({
            message: 'Recipe created successfully',
            recipeId: result.insertId,
            dishName: dishName,
            imagePath: imagePath
        });
    });
});

app.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
});


