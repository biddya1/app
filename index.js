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
    try {
        const blogs = await Blog.findAll();
        res.render("home", { blogs });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching blogs");
    }
});

// ADD BLOG PAGE
app.get("/addblog", (req, res) => {
    res.render("addBlog");
});

// ADD BLOG POST
app.post("/addblog", async (req, res) => {
    const { title, subTitle, description } = req.body;

    if (!title || !subTitle || !description) {
        return res.send("Please provide title, subTitle, and description");
    }

    try {
        await Blog.create({
            title,
            subTitle,
            description,
        });
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding blog");
    }
});

// SINGLE BLOG PAGE
app.get("/blog/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const foundData = await Blog.findOne({  // use findOne instead of findAll
            where: { id: id }
        });

        if (!foundData) return res.status(404).send("Blog not found");

        res.render("singleBlog", { blog: foundData });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching blog");
    }
});

// DELETE BLOG
app.get("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await Blog.destroy({
            where: { id: id }  // fixed typo (was whwrw)
        });
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting blog");
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
