//sign in  and sign up, front end for home and default food preferences )(the sections on the front of the homepage-> like picking vegetarian foods and whatnot) 
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 8000; 

app.use(bodyParser.json())

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
    
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.length > 0) {
            res.status(200).json({ message: 'Login successful' });
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

        res.status(200).json({ message: 'Like added successfully' });
    });
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

app.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
});


