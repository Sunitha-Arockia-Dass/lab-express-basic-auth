const router = require("express").Router();
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

/* GET home page */
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      User.create({ username, password: hashedPassword }).then((user) => {
        res.render("index");
      });
    });
});
router.get("/user-profile", isLoggedIn, (req, res, next) => {
  console.log(req.session.user);
  const { user } = req.session;
  const text = "Please Log in to view ur page"; // Set 'text' variable here

  if (user) {
    res.render("users/user-profile", { user });
  } else {
    console.log(text);
    res.render("auth/login", { flashMessage: res.locals.flashMessage });
  }
});
router.get("/main", isLoggedIn, (req, res, next) => {
  console.log(req.session.user);
  const { user } = req.session;
  const text = "Please Log in to view ur page"; // Set 'text' variable here

  if (user) {
    res.render("users/main", { user });
  } else {
    console.log(text);
    res.render("auth/login", { flashMessage: res.locals.flashMessage });
  }
});
router.get("/private", isLoggedIn, (req, res, next) => {
  console.log(req.session.user);
  const { user } = req.session;
  const text = "Please Log in to view ur page"; // Set 'text' variable here

  if (user) {
    res.render("users/private", { user });
  } else {
    console.log(text);
    res.render("auth/login", { flashMessage: res.locals.flashMessage });
  }
});

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login", { userInLogin: true });
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  if (username == "" || password == "") {
    res.render("auth/login", {
      userInLogin: true,
      errorMessage: "Please fill all details",
    });
  }
  User.findOne({ username }).then((foundUser) => {
    if (!foundUser) {
      console.log("user not registered");
      res.render("auth/login", {
        userInLogin: true,
        errorMessage: "User not found and/or incorrect password",
      });
    } else if (bcryptjs.compareSync(password, foundUser.password)) {
      req.session.user = foundUser;
      res.redirect("/user-profile");
    } else {
      console.log(`incorrect password`);
      res.render("auth/login", {
        userInLogin: true,
        errorMessage: "Please fill all details",
      });
    }
  });
});

router.get("/main", isLoggedIn, (req, res, next) => {
  const { user } = req.session;

  res.render("users/main");
});

router.get("/private", isLoggedIn, (req, res, next) => {
  const { user } = req.session;

  res.render("users/private");
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
