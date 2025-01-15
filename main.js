document.addEventListener('DOMContentLoaded', () => {
    const signInBtn = document.getElementById('SignInBtn');
    const signUpBtn = document.getElementById('SignUpBtn');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');

    signInForm.style.display = 'block';
    signUpForm.style.display = 'none';

    signInBtn.addEventListener('click', () => {
        signInForm.style.display = 'block';
        signUpForm.style.display = 'none';
        signInBtn.classList.add('active');
        signUpBtn.classList.remove('active');

    });
    signUpBtn.addEventListener('click', () => {
        signUpForm.style.display = 'block';
        signInForm.style.display = 'none';
        signUpBtn.classList.add('active');
        signInBtn.classList.remove('active');
    });

});
