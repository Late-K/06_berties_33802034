# Create database script for Berties books

# Create the database
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

# Create the tables
CREATE TABLE IF NOT EXISTS books (
    id     INT AUTO_INCREMENT,
    name   VARCHAR(50),
    price  DECIMAL(5, 2),
    PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS users (
    id              INT AUTO_INCREMENT,
    username        VARCHAR(50),
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    email           VARCHAR(255),
    hashedPassword  VARCHAR(255),
    PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS auditlog (
    id          INT AUTO_INCREMENT,
    username    VARCHAR(50),
    status      VARCHAR(50),
    time        DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id));

# Create the application user
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON berties_books.* TO ' berties_books_app'@'localhost';
