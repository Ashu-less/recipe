const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
var http = require('http');
var fs = require('fs');

const app = express();
app.use(bodyParser.json())
const port = 8000; 


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ashutosh1!",
    database: "recinsta"
});

http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(port);

db.connect(function(err) {
    if (err) throw err;
    console.log("MYSQL Connected");


//thru sign up page
    app.post('./index.html', async (req, res) => {
        const { username, password, firstName, lastName, email, preference} = req.body;
        //const hashedpassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, password, email, first_name, last_name, preference) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [username, password, email, firstName, lastName, preference], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error saving user in database');
            } else {
                res.status(201).send('User registered in database');
            }
        });
        res.send("POST Request Called")
    })

    app.get('./index.html', (req, res) => {
        res.send("GET Request Called test 1")
        console.log("hohoho 1")
    })

});

app.get('./index.html', (req, res) => {
    res.send("GET Request Called test 2")
    console.log("hehehe 2")
})






//thru sign in page here
app.post('/main', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching user.');
        } else if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
            res.status(401).send('Invalid username or password.');
        } else {
            res.status(200).send('Login successful!');
        }
    });
});

app.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
});