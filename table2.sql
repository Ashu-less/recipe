CREATE TABLE IF NOT EXISTS users(
user_id INTEGER NOT NULL AUTO_INCREMENT ,
username TEXT NOT NULL ,
password TEXT NOT NULL, 
first_name TEXT NOT NULL,
last_name TEXT NOT NULL,
preference TEXT NOT NULL,
PRIMARY KEY(user_id)

);
