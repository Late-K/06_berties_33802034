require("dotenv").config();
url = "../users/login";

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect(process.env.URL || url); // redirect to the login page
  } else {
    next(); // move to the next middleware function
  }
};
module.exports = redirectLogin;
