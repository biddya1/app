const db = require("../../config/dbConfig");
const User = db.User;
const bcrypt = require("bcryptjs");

// Show registration form
exports.renderRegisterForm = (req, res) => {
    res.render("register");
};

// Show login form
exports.renderLoginForm = (req, res) => {
    res.render("login");
};

// -----------------------------
// Handle registration
// -----------------------------
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // ✅ Check for empty fields
    if (!username || !email || !password) {
        return res.status(400).send("All fields are required");
    }

    try {
        // ✅ Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send("Email already exists");
        }

        // ✅ Create new user
        await User.create({
            username,
            email,
            password: bcrypt.hashSync(password, 12)
        });

        // ✅ Redirect to login page after registration
        res.redirect("/login");

    } catch (err) {
        console.error(err);

        // ✅ Handle Sequelize validation errors
        if (err.name === "SequelizeValidationError") {
            const messages = err.errors.map(e => e.message).join(", ");
            return res.status(400).send("Validation error: " + messages);
        }

        if (err.name === "SequelizeUniqueConstraintError") {
            return res.status(400).send("Email already exists");
        }

        res.status(500).send("Server error");
    }
};

// -----------------------------
// Handle login
// -----------------------------
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // ✅ Check for empty fields
    if (!email || !password) {
        return res.send("Please provide email and password");
    }

    try {
        // ✅ Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) return res.send("No user exists with that email");

        // ✅ Compare password
        const isMatched = bcrypt.compareSync(password, user.password);

        if (isMatched) {
            res.send("Login successful");
        } else {
            res.send("Invalid email or password");
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};
