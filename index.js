const express = require("express");
const path = require("path");
const { DataTypes } = require("sequelize");

const db = require("./config/dbConfig"); // Sequelize connection & models
const { storage, multer } = require("./middleware/multerConfig");

const upload = multer({ storage });
const Blog = db.blogs;
const sequelize = db.sequelize;

const app = express();

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve uploads and public folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

// ===== HOME PAGE =====
app.get("/", async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        res.render("home", { blogs });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching blogs");
    }
});

// ===== ADD BLOG PAGE =====
app.get("/addblog", (req, res) => {
    res.render("addBlog");
});

// ===== ADD BLOG POST =====
app.post("/addblog", upload.single("image"), async (req, res) => {
    const { title, subTitle, description } = req.body;

    if (!title || !subTitle || !description) {
        return res.send("Please provide all fields");
    }

    try {
        await Blog.create({
            title,
            subTitle,
            description,
            image: req.file ? `/uploads/${req.file.filename}` : null,
        });
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding blog");
    }
});

// ===== SINGLE BLOG PAGE =====
app.get("/blog/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findByPk(id);
        if (!blog) return res.status(404).send("Blog not found");
        res.render("singleBlog", { blog });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching blog");
    }
});

// ===== DELETE BLOG =====
app.get("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await Blog.destroy({ where: { id } });
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting blog");
    }
});

// ===== UPDATE BLOG PAGE =====
app.get("/update/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findByPk(id);
        if (!blog) return res.status(404).send("Blog not found");
        res.render("updateBlog", { blog });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading update page");
    }
});

// ===== UPDATE BLOG POST =====
app.post("/update/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const { title, subTitle, description } = req.body;

    const updateData = { title, subTitle, description };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    try {
        await Blog.update(updateData, { where: { id } });
        res.redirect(`/blog/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating blog");
    }
});

// ===== START SERVER =====
(async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("Database synced");

        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Error connecting to database:", err);
    }
})();
