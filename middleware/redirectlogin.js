const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/usr/148/users/login"); // redirect to the login page
  } else {
    next(); // move to the next middleware function
  }
};
module.exports = redirectLogin;
