document.addEventListener('DOMContentLoaded', function() {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const navbar = document.getElementById('navbar');

    if (signInForm) {
        signInForm.addEventListener('submit', function(event) {
            handleSignin(event);
        });
    }

    if (signUpForm) {
        signUpForm.addEventListener('submit', function(event) {
            handleSignup(event);
        });
    }

    document.getElementById("homeBtn").addEventListener("click", function() {
        showSection("homepageSection");
        setActiveButton("homeBtn");
    });

    document.getElementById("suggestedBtn").addEventListener("click", function() {
        showSection("suggestedSection");
        setActiveButton("suggestedBtn");
    });

    document.getElementById("createBtn").addEventListener("click", function() {
        showSection("createSection");
        setActiveButton("createBtn");
    });

    document.getElementById("profileBtn").addEventListener("click", function() {
        showSection("profileSection");
        setActiveButton("profileBtn");
    });

    document.getElementById("settingsBtn").addEventListener("click", function() {
        showSection("settingsSection");
        setActiveButton("settingsBtn");
    });

    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const likeCountElement = this.parentElement.querySelector('.likes');
            let currentLikes = parseInt(likeCountElement.textContent);
            currentLikes++;
            likeCountElement.textContent = currentLikes;

            this.classList.add('liked');
            setTimeout(() => {
                this.classList.remove('liked');
            }, 300);
        });
    });
});

function handleSignin(event) {
    event.preventDefault();
    const username = document.querySelector("#signInForm input[type='text']").value;
    const password = document.querySelector("#signInForm input[type='password']").value;

    if (username && password) {
        fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) {
                document.getElementById("auth-section").style.display = "none";
                document.getElementById("navbar").style.display = "flex";
                document.getElementById("homepageSection").style.display = "flex";
                setActiveButton("homeBtn");
            } else {
                alert('Invalid username or password');
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert("Please enter valid username and password");
    }
}

function handleSignup(event) {
    event.preventDefault();
    const username = document.querySelector("#signUpForm input[type='text']").value;
    const password = document.querySelector("#signUpForm input[type='password']").value;
    const firstName = document.querySelector("#signUpForm input[id='firstName']").value;
    const lastName = document.querySelector("#signUpForm input[id='lastName']").value;
    const email = document.querySelector("#signUpForm input[id='email']").value;
    const preference = document.getElementById("preference").value;

    if (username && password && firstName && lastName && email) {
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, firstName, lastName, email, preference })
        })
        .then(response => {
            if (response.ok) {
                document.getElementById("auth-section").style.display = "none";
                document.getElementById("navbar").style.display = "flex";
                document.getElementById("homepageSection").style.display = "flex";
                setActiveButton("homeBtn");
            } else {
                alert('Error signing up');
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert("Please fill in all fields.");
    }
}

function showSection(sectionId) {
    const sections = ["homepageSection", "suggestedSection", "createSection", "profileSection", "settingsSection"];
    sections.forEach(id => {
        document.getElementById(id).style.display = id === sectionId ? "block" : "none";
    });
}

function setActiveButton(buttonId) {
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(buttonId).classList.add('active');
}

document.getElementById("SignInBtn").addEventListener("click", function () {
    document.getElementById("signInForm").classList.add("active");
    document.getElementById("signUpForm").classList.remove("active");

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

document.addEventListener('DOMContentLoaded', function() {
    const mealType = document.getElementById('mealType');
    const dietType = document.getElementById('dietType');
    const cookingTime = document.getElementById('cookingTime');
    const searchInput = document.getElementById('searchRecipes');
    const searchBtn = document.querySelector('.search-btn');

    function filterRecipes() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedMeal = mealType.value;
        const selectedDiet = dietType.value;
        const selectedTime = cookingTime.value;

        const recipeCards = document.querySelectorAll('.recipe-card');
        
        recipeCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            let shouldShow = true;

            if (searchTerm && !title.includes(searchTerm)) {
                shouldShow = false;
            }


            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    searchBtn.addEventListener('click', filterRecipes);
    searchInput.addEventListener('keyup', filterRecipes);
    mealType.addEventListener('change', filterRecipes);
    dietType.addEventListener('change', filterRecipes);
    cookingTime.addEventListener('change', filterRecipes);
});



function toggleLike() {
    let likeBtn = document.querySelector('.like-btn');
    likeBtn.classList.toggle('active');
}

/*function likeCount()
{
    var likeCount = 0;
    for()
}*/

$(function() {
    $(".heart").on("click", function() {
      $(this).toggleClass("is-active");
    });
  });