const express = require("express");
const router = express.Router();
const { renderRegisterForm, registerUser } = require("../controller/user/userController");

router.route("/register").get(renderRegisterForm);
router.route("/register").post(registerUser);

module.exports = router;
