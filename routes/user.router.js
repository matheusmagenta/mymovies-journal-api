const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const users = []; // for testing purposes
const passport = require("passport");

const userController = require("../controllers/user.controller.js");

// USER LOGIN, LOGOUT AND REGISTER HANDLING
/* GET register of users */
router.get("/register", (req, res) => {
  res.render("register");
});

/* POST register of users */
router.post("/register", userController.registerUser);

/* POST login of users */
router.post("/login", userController.loginUser);

/* POST logout of users */
router.post("/logout", userController.logoutUser);

/* POST token of users */
router.post("/token", userController.tokenUser);

module.exports = router;
