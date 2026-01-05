const db = require("../../config/dbConfig");
const User = db.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ------------------- Show registration form -------------------
exports.renderRegisterForm = (req, res) => {
    res.render("register"); // make sure register.ejs exists
};

// ------------------- Show login form -------------------
exports.renderLoginForm = (req, res) => {
    res.render("login"); // make sure login.ejs exists
};

// ------------------- Handle registration -------------------
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send("All fields are required");
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send("Email already exists");
        }

        await User.create({
            username,
            email,
            password: bcrypt.hashSync(password, 12)
        });

        return res.redirect("/login");

    } catch (err) {
        console.error("REGISTER ERROR 👉", err);
        return res.status(500).send("Server error");
    }
};

// ------------------- Handle login -------------------
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send("Please provide email and password");
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.send("Invalid email or password");
        }

        const isMatched = bcrypt.compareSync(password, user.password);
        if (!isMatched) {
            return res.send("Invalid email or password");
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id },
            process.env.secretKey || "secret",
            { expiresIn: "1d" }
        );

        // Set cookie visible in browser
        res.cookie("token", token, {
            httpOnly: false,
            sameSite: "lax",
            maxAge: 24*60*60*1000,
            path: "/"
        });

        // Optional: username cookie for display
        res.cookie("name", user.username, {
            httpOnly: false,
            sameSite: "lax",
            maxAge: 24*60*60*1000,
            path: "/"
        });

        return res.redirect("/"); // redirect home

    } catch (err) {
        console.error("LOGIN ERROR 👉", err);
        return res.status(500).send("Server error");
    }
};

// ------------------- Handle logout -------------------
// ✅ Function name corrected to lowercase
exports.logoutUser = (req,res) => {
    res.clearCookie('token');
    res.clearCookie('name'); // clear username cookie too
    res.redirect("/login");
};
