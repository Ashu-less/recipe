

document.addEventListener('DOMContentLoaded', () => {


    const signInBtn = document.getElementById('SignInBtn');
    const signUpBtn = document.getElementById('SignUpBtn');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');

    // Initially display the Sign In form
    signInForm.classList.add('active');
    signUpForm.classList.remove('active');

    signInBtn.addEventListener('click', () => {
        signInForm.classList.add('active');
        signUpForm.classList.remove('active');
        signInBtn.classList.add('active');
        signUpBtn.classList.remove('active');
    });

    signUpBtn.addEventListener('click', () => {
        signUpForm.classList.add('active');
        signInForm.classList.remove('active');
        signUpBtn.classList.add('active');
        signInBtn.classList.remove('active');


  

    //var mysql = require('mysql');
    /*var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Ashutosh1!",
        database: ""
      });*/


    });
});
