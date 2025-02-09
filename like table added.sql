CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    user_id INT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    UNIQUE (recipe_id, user_id)  -- Ensure a user can only like a recipe once
);