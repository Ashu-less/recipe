document.getElementById("signInForm").addEventListener("submit", function (event) {
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
                // Show homepage section
                document.getElementById("auth-section").style.display = "none";
                document.getElementById("homepageSection").style.display = "flex";
            } else {
                alert('Invalid username or password');
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert("Please enter valid username and password");
    }
});


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