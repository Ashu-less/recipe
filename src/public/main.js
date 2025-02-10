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

    fetch('/recipes')
    .then(response => response.json())
    .then(recipes => {
        const recipeContainer = document.getElementById('recipeContainer');
        if (!recipeContainer) {
            console.error('Error: recipeContainer not found');
            return;
        }
        recipeContainer.innerHTML = '';

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
                <div class="icon"><img src="/images/${encodeURIComponent(recipe.dishName)}.jpg" alt="${recipe.dishName}"></div>
                <h3>${recipe.dishName}</h3>
                <div class="actions">
                    <span class="like-count">❤️ <span class="likes" data-recipe-id="${recipe.recipe_id}">${recipe.likes}</span> Likes</span>
                    <button class="like-btn" data-recipe-id="${recipe.recipe_id}">❤️ Like</button>
                </div>
                <div class="comments-section">
                    <h4>Comments:</h4>
                    <div class="comments-container" id="comments-${recipe.recipe_id}"></div>
                    <input type="text" id="comment-input-${recipe.recipe_id}" placeholder="Add a comment..." />
                    <button class="comment-btn" data-recipe-id="${recipe.recipe_id}">💬 Comment</button>
                </div>
            `;
            recipeContainer.appendChild(recipeCard);

            // comments are loaded here 
            loadComments(recipe.recipe_id);
        });

        // liking the recipes
        document.querySelectorAll('.like-btn').forEach(button => {
            button.addEventListener('click', function () {
                const recipeId = this.getAttribute('data-recipe-id');

                fetch(`/like/${recipeId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            alert(data.error);
                        } else {
                            let likeCountElement = document.querySelector(`.likes[data-recipe-id='${recipeId}']`);
                            if (likeCountElement) {
                                likeCountElement.textContent = data.likes;
                            }
                        }
                    })
                    .catch(error => console.error('Error:', error));
            });
        });

        // sumbitting comments section
        document.querySelectorAll('.comment-btn').forEach(button => {
            button.addEventListener('click', function () {
                const recipeId = this.getAttribute('data-recipe-id');
                const commentInput = document.getElementById(`comment-input-${recipeId}`);
                const commentText = commentInput.value.trim();

                if (!commentText) {
                    alert("Comment cannot be empty!");
                    return;
                }

                const user_id = sessionStorage.getItem('user_id');
                console.log('User ID:', user_id);
                if (!user_id) {
                    alert("You must be logged in to comment.");
                    return;
                }

                fetch(`/comment/${recipeId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id, comment_text: commentText })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            alert(data.error);
                        } else {
                            commentInput.value = ''; 
                            loadComments(recipeId); 
                        }
                    })
                    .catch(error => console.error('Error:', error));
            });
        });
    })
    .catch(error => console.error('Error fetching recipes:', error));

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
        .then(response => response.json())
        .then(data => {
            console.log('Sign-in response:', data); // Debugging log
            if (data.message) {
                sessionStorage.setItem('user_id', data.userId); // Store user_id
                console.log('User ID saved in sessionStorage:', data.userId); // Debugging log
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
        const section = document.getElementById(id);
        if (id === sectionId) {
            section.style.display = "block"; 
        } else {
            section.style.display = "none";
        }
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


$(function() {
    $(".heart").on("click", function() {
      $(this).toggleClass("is-active");
    });
  });

  function loadSuggestedRecipes(preference) {
    fetch(`/suggested?preference=${preference}`)
        .then(response => response.json())
        .then(recipes => {
            const suggestedRecipesContainer = document.getElementById('suggestedRecipes');
            suggestedRecipesContainer.innerHTML = '';
            
            recipes.sort((a, b) => b.likes - a.likes);
            recipes.forEach(recipe => {
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('recipe-card');
                recipeCard.innerHTML = `
                    <div class="icon">${recipe.icon}</div>
                    <h3>${recipe.name}</h3>
                    <p>${recipe.description}</p>
                    <div class="actions">
                        <span>❤️ ${recipe.likes} Likes</span>
                        <span>💬 ${recipe.comments} Comments</span>
                    </div>
                `;
                suggestedRecipesContainer.appendChild(recipeCard);
            });
        })
        .catch(error => console.error('Error loading suggested recipes:', error));
  }

  function loadComments(recipeId) {
    fetch(`/comments/${recipeId}`)
        .then(response => response.json())
        .then(comments => {
            const commentsContainer = document.getElementById(`comments-${recipeId}`);
            if (!commentsContainer) return;

            commentsContainer.innerHTML = '';
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `<strong>${comment.username}</strong>: ${comment.comment}`;
                commentsContainer.appendChild(commentElement);
            });
        })
        .catch(error => console.error('Error fetching comments:', error));
}

  document.getElementById('createRecipeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const recipeName = document.getElementById('recipeName').value;
    const recipeIngredients = document.getElementById('recipeIngredients').value;
    const recipeSteps = document.getElementById('recipeSteps').value;
    const recipeImage = document.getElementById('recipeImage').files[0];

    const formData = new FormData();
    formData.append('name', recipeName);
    formData.append('ingredients', recipeIngredients);
    formData.append('steps', recipeSteps);
    formData.append('image', recipeImage);

    fetch('/createRecipe', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Recipe created successfully!');
            window.location.reload();  
        } else {
            alert('Failed to create recipe.');
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordField = document.getElementById('profilePassword');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        this.textContent = 'Hide';
    } else {
        passwordField.type = 'password';
        this.textContent = 'Show';
    }
});

document.getElementById('settingsForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const newPassword = document.getElementById('changePassword').value;
    const country = document.getElementById('country').value;
    const themeColor = document.getElementById('themeColor').value;
    
    fetch('/updateSettings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword, country, themeColor })
    })
    .then(response => {
        if (response.ok) {
            alert('Settings updated successfully!');
        } else {
            alert('Failed to update settings.');
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById("signOutBtn").addEventListener("click", function() {
    signOut();
});


function signOut() {
    fetch('/signout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.ok) {
            document.getElementById("navbar").style.display = "none";
            document.getElementById("auth-section").style.display = "block";
            document.getElementById("homepageSection").style.display = "none";
            document.getElementById("suggestedSection").style.display = "none";
            document.getElementById("createSection").style.display = "none";
            document.getElementById("profileSection").style.display = "none";
            document.getElementById("settingsSection").style.display = "none";
        } else {
            alert('Error signing out');
        }
    })
    .catch(error => console.error('Error:', error));
}


function handleSignup(event) {
    event.preventDefault();
    const username = document.querySelector("#profileSection input[type='text']").value;
    const password = document.querySelector("#profileSection input[type='password']").value;
    const firstName = document.querySelector("#profileSection input[id='firstName']").value;
    const lastName = document.querySelector("#profileSection input[id='lastName']").value;
    const email = document.querySelector("#profileSection input[id='email']").value;
    const preference = document.getElementById("preference").value;

    if (username && password && firstName && lastName && email) {
        fetch('/editprofile', {
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
                alert('Error changing profile');
            }
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert("Please fill in all fields.");
    }
}


