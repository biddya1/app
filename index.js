const express = require("express");
const path = require("path");
const { DataTypes } = require("sequelize");

const sequelize = require("./config/dbConfig");
const { storage,multer } = require("./middleware/multerCongig");

const upload = multer({storage: storage});
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
app.post("/addblog",upload.single('image'), async (req, res) => {
    console.log(req.file);
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
        const foundData = await Blog.findOne({
            where: { id }
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
            where: { id }
        });
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting blog");
    }
});

// UPDATE BLOG PAGE (FIXED)
app.get("/update/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const blog = await Blog.findByPk(id);

        if (!blog) return res.status(404).send("Blog not found");

        res.render("updateBlog", { blog });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading update page");
    }
});
//file handling garna ko lagi
app.post("/addblog",async(req,res)=>{

})



// UPDATE BLOG POST 
app.post("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { title, subTitle, description } = req.body;

    try {
        await Blog.update(
            { title, subTitle, description },
            { where: { id } }
        );

        res.redirect(`/blog/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating blog");
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
