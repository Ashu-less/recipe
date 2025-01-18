

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
        signUpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
        
            const data = {
                username: signUpForm.querySelector('input[placeholder="Username"]').value,
                password: signUpForm.querySelector('input[placeholder="Password"]').value,
                email: signUpForm.querySelector('input[placeholder="Email"]').value,
                firstName: signUpForm.querySelector('input[placeholder="First Name"]').value,
                lastName: signUpForm.querySelector('input[placeholder="Last Name"]').value,
                preference: signUpForm.querySelector('#preference').value
            };
        
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        
            if (response.ok) {
                alert('Sign up successful!');
                signUpForm.reset();
            } else {
                alert('Sign up failed. Try again.');
            }
        });

        signInForm.addEventListener('submit', async (e) => {
            e.preventDefault();
        
            const data = {
                username: signInForm.querySelector('input[placeholder="Username"]').value,
                password: signInForm.querySelector('input[placeholder="Password"]').value
            };
        
            const response = await fetch('http://localhost:3000/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        
            if (response.ok) {
                alert('Sign in successful!');
            } else {
                alert('Invalid username or password.');
            }
        });
    });
});
