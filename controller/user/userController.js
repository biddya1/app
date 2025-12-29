const db = require("../../config/dbConfig"); // adjust path
const User = db.users; // Use the users model from db
const bcrypt = require("bcryptjs"); // fixed typo

// Show registration form
exports.renderRegisterForm = (req, res) => {
    res.render("register"); // or res.send("Form page")
};

// Handle registration
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send("All fields are required");
    }

    try {
        const user = await User.create({
            username, 
            email, 
            password: bcrypt.hashSync(password, 12) // hash password
        });
        res.send(`User ${user.username} registered successfully!`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};
