CREATE TABLE IF NOT EXISTS recipes (
    recipe_id INTEGER NOT NULL AUTO_INCREMENT,
    dishName TEXT NOT NULL,
    steps TEXT NOT NULL,
    dishType TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    PRIMARY KEY(recipe_id)
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id INTEGER NOT NULL AUTO_INCREMENT,
    recipe_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(comment_id),
    FOREIGN KEY(recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE
);