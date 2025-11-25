# Berties Books

Code for Dynamic Web Applications module.

## Technologies Used

- HTML
- CSS
- Node.js
- Express
- EJS
- MySQL

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js & npm](https://nodejs.org/en)
- A modern web browser
- [MySql](https://dev.mysql.com/downloads/mysql/)

### Clone the repository

```bash
git clone https://github.com/Late-K/berties-books.git
cd berties-books
```

## Setting up the database

In your MySql database:

```bash
source create_db.sql
source insert_test_data.sql
```

## Starting the server up

First install dependencies, in terminal:

```bash
npm i
```

Then start up the server:

```bash
node index.js
```

This is accessable locally on http://localhost:8000/

## Shutting Down the Server

Press CTRL + C in the terminal to stop the server.

## Dotenv

To protect sensitive database credentials I implemented dotenv.

### Setup

First install dotenv: (skip if already installed dependencies)

```bash
npm install dotenv
```

Then create a .env file in your project root directiory to store private values:

```ini
BB_USER='berties_books_app'
BB_PASSWORD='qwertyuiop'
BB_DATABASE='berties_books'
```

These values can now be used in your database connection pool:

```js
require("dotenv").config();

const db = mysql.createPool({
  user: process.env.BB_USER,
  password: process.env.BB_PASSWORD,
  database: process.env.BB_DATABASE,
});
```

## Audit

Audits improve security by recording successful and failed login attempts.

### How it works

In order to log these audits, we create a new database table:

```sql
CREATE TABLE auditlog (id INT AUTO_INCREMENT,
    username VARCHAR(100),
    status VARCHAR(20),
    time DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id));
```

Every time a user attempts to log in (whether successful or not), an entry is added to the audit log:

```js
function logAudit(username, status) {
  // saving audit logs in database
  let sql = "INSERT INTO auditlog (username, status) VALUES (?, ?)";
  // execute sql query
  db.query(sql, [username, status], (err, result) => {
    if (err) {
      next(err);
    }
  });
}

//example usage: logAudit(req.body.username, "unknown username");
```

We can then fetch these from the database and display it on our /users/audit route

```js
router.get("/audit", function (req, res, next) {
  let sqlquery = "SELECT * FROM auditlog ORDER BY time DESC"; //get all audit logs (list by time added)
  // execute sql query
  db.query(sqlquery, (err, result) => {
    if (err) {
      next(err);
    }
    res.render("audit.ejs", { availableAudit: result });
  });
});
```

This allows admins to see all login attempts.

## Restricted Access

Most pages in this application are restricted behind user authentication, with only the about page, login page, and registration page being accessable without logging in.

This is enforced with redirectLogin() middleware that checks whether the user has an active session, if not they are automatically redirected to the login page.

This ensures that sensitive data, such as lists of users, cannot be accessed anonymously without permission.

## Validation

I have added validation logic using the express-validator library to the registration, login and addbook pages, which are all pages aside from search books that require a user input. This helps prevent db crashes, and ensures application and user security by validating names and passwords.

## Sanatisation

I have wrapped many fields with req.sanatize from the express-sanatizer libary to protect them from XSS attacks. XSS happens when malicious users insert JS into fields that are then displayed on html pages.

These fields include:

- usernames
- first names
- last names
- emails
- book names
- search inputs

Passwords and price values arent wrapped since they should either never be rendered in html, or cant contain scripts due to their input type.
