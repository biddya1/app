const express = require("express");
const router = express.Router();
const {
  renderRegisterForm,
  registerUser,
  renderLoginForm,
  loginUser
} = require("../controller/user/userController");

// Registration routes
router.route("/register").get(renderRegisterForm);
router.route("/register").post(registerUser);

// Login routes
router.route("/login").get(renderLoginForm);
router.route("/login").post(loginUser); // add this if missing

module.exports = router;
