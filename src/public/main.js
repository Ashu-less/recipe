document.getElementById("signInForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        

        // Hide the authentication section
        document.getElementById("authSection").style.display = "none";

        // Show the homepage section
        document.getElementById("homepageSection").style.display = "flex";
    } else {
        alert("Please enter valid username and password");
    }
});


document.getElementById("SignInBtn").addEventListener("click", function () {
    document.getElementById("signInForm").classList.add("active");
    document.getElementById("signUpForm").classList.remove("active");

    // Update button styles
    document.getElementById("SignInBtn").classList.add("active");
    document.getElementById("SignUpBtn").classList.remove("active");
});

document.getElementById("SignUpBtn").addEventListener("click", function () {
    document.getElementById("signUpForm").classList.add("active");
    document.getElementById("signInForm").classList.remove("active");

    document.getElementById("SignUpBtn").classList.add("active");
    document.getElementById("SignInBtn").classList.remove("active");
});

document.getElementById("signUpForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.querySelector("#signUpForm input[placeholder='First Name']").value;
    const lastName = document.querySelector("#signUpForm input[placeholder='Last Name']").value;
    const username = document.querySelector("#signUpForm input[placeholder='Username']").value;
    const password = document.querySelector("#signUpForm input[placeholder='Password']").value;
    const email = document.querySelector("#signUpForm input[placeholder='Email']").value;
    const preference = document.getElementById("preference").value;

    if (firstName && lastName && username && password && email) {
        

        alert("Sign up successful! You can now log in.");
        document.getElementById("SignInBtn").click();
    } else {
        alert("Please fill in all fields.");
    }
});

