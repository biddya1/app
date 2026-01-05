const express = require("express");
const router = express.Router();

const {
  renderRegisterForm,
  registerUser,
  renderLoginForm,
  loginUser,
  logoutUser // ✅ corrected function name (lowercase 'o')
} = require("../controller/user/userController");

// ------------------- Registration Routes -------------------
router.get("/register", renderRegisterForm);
router.post("/register", registerUser);

// ------------------- Login Routes -------------------
router.get("/login", renderLoginForm);
router.post("/login", loginUser);

// ------------------- Logout Route -------------------
router.get("/logout", logoutUser);

module.exports = router;
