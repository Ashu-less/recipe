

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
    });
    //var mysql = require('mysql');
    /*var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Ashutosh1!",
        database: ""
      });*/

    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#6200ea';
            input.style.boxShadow = '0 0 5px rgba(98, 0, 234, 0.5)';
        });
        input.addEventListener('blur', () => {
            input.style.borderColor = '#ccc';
            input.style.boxShadow = 'none';
        });
    });

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            form.style.animation = 'shake 0.3s';
            setTimeout(() => form.style.animation = '', 300);
        });
    });
});
