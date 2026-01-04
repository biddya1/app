const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig").sequelize;

// ✅ Correctly import User model
const User = require("../model/userModel")(sequelize, DataTypes);

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.redirect("/login");

    // Verify JWT
    const verifiedResult = await promisify(jwt.verify)(
      token,
      process.env.secretKey || "secret"
    );

    // Find user in DB
    const user = await User.findByPk(verifiedResult.id);
    if (!user) return res.redirect("/login");

    // Attach user to request
    req.userId = verifiedResult.id;

    next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    return res.redirect("/login");
  }
};
