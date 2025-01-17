import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import bcrypt  from ('bcrypt');

const app = express();
app.use(bodyParser.json())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ashutosh1!",
    database: "recinsta"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("MYSQL Connected");

});

app.post('/signUp', async (req, res) => {
    const { username, password, firstName, lastName, email, preference} = req.body;
    const hashpassword = await bcrypt.hash(password, 10);
    res.send("POST Request Called")
})