const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    res.locals.flashMessage = "Please log in to view your profile.";
  }
  next();
};
const isLoggedOut = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};
module.exports = {
  isLoggedIn,
  isLoggedOut,
};
