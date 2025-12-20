const express = require("express");
const path = require("path");
const { DataTypes } = require("sequelize");

const sequelize = require("./config/dbConfig");
const Blog = require("./config/model/blogModel")(sequelize, DataTypes);

const app = express();

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HOME PAGE
app.get("/", async (req, res) => {
    const blogs = await Blog.findAll();
    res.render("home", { blogs });
});

// ADD BLOG PAGE
app.get("/addblog", (req, res) => {
    res.render("addBlog");
});

// ADD BLOG POST
app.post("/addblog", async (req, res) => {
    const { title, subTitle, description } = req.body;

    try {
        await Blog.create({
            title,
            subTitle,
            description,
        });

        res.send("Blog added successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding blog");
    }
});

// Sync DB and start server
(async () => {
    try {
        await sequelize.sync();
        console.log("Database synced");

        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Error connecting to database:", err);
    }
})();
