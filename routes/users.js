// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/register", function (req, res, next) {
  res.render("register.ejs");
});

router.post("/registered", function (req, res, next) {
  const plainPassword = req.body.password;
  bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
    // Store hashed password in your database.
    let sqlquery =
      "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
    // execute sql query
    let newrecord = [
      req.body.username,
      req.body.first,
      req.body.last,
      req.body.email,
      hashedPassword,
    ];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          // duplicate username
          return res.send("Registration failed: Username already exists.");
        }
        next(err);
        if (req.body.username.length > 50) {
          return res.send(
            "Username too long: maximum length is 50 characters."
          );
        }
      } else
        res.send(
          "Hello " +
            req.body.first +
            " " +
            req.body.last +
            ", you are now registered! We will send an email to you at " +
            req.body.email +
            ". Your password is: " +
            req.body.password +
            " and your hashed password is: " +
            hashedPassword
        );
    });
  });
});

router.get("/list", function (req, res, next) {
  let sqlquery = "SELECT * FROM users"; // get all the users
  // execute sql query
  db.query(sqlquery, (err, result) => {
    if (err) {
      next(err);
    }
    res.render("userlist.ejs", { availableUsers: result });
  });
});

router.get("/login", function (req, res, next) {
  res.render("login.ejs");
});

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

router.post("/loggedin", function (req, res, next) {
  let sqlquery = "SELECT * FROM users WHERE username = ?"; //get username
  // execute sql query
  db.query(sqlquery, [req.body.username], (err, result) => {
    if (err) {
      next(err);
    }
    if (result.length == 0) {
      //username doesnt exist in db
      logAudit(req.body.username, "unknown username");
      return res.send("Login failed: Unknown username.");
    }
    bcrypt.compare(
      req.body.password,
      result[0].hashedPassword,
      function (err, match) {
        if (err) {
          next(err);
        } else if (match == true) {
          logAudit(req.body.username, "logged in");
          res.send(
            "Welcome back " +
              result[0].first_name +
              " " +
              result[0].last_name +
              ", you are now logged in!"
          );
        } else {
          logAudit(req.body.username, "incorrect password");
          res.send("Login failed: Incorrect password.");
        }
      }
    );
  });
});

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

// Export the router object so index.js can access it
module.exports = router;
