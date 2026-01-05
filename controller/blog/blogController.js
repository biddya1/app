const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/dbConfig").sequelize;

// Import Blog model
const Blog = require("../../model/blogModel")(sequelize, DataTypes);

// ✅ Import User model
const User = require("../../model/userModel")(sequelize, DataTypes);

// ✅ Define association
Blog.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Blog, { foreignKey: "userId" });

// List all blogs (Homepage)
exports.renderHome = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      order: [["createdAt", "DESC"]],
      include: {
        model: User,
        as: "user",               // matches alias
        attributes: ["username"], // only fetch username
      },
    });
    res.render("home", { blogs });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

// Render add blog page
exports.renderAddBlog = (req, res) => res.render("addBlog");

// Add new blog
exports.addBlog = async (req, res) => {
  const userId = req.user ? req.user.id : 1;
  const { title, subTitle, description } = req.body;

  if (!title || !subTitle || !description)
    return res.send("Please provide all fields");

  try {
    await Blog.create({
      title,
      subTitle,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      userId,
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding blog");
  }
};

// View single blog
exports.renderSingleBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByPk(id, {
      include: {
        model: User,
        as: "user",
        attributes: ["username"],
      },
    });

    if (!blog) return res.status(404).send("Blog not found");

    res.render("singleBlog", { blog });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching blog");
  }
};


// Delete blog
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    await Blog.destroy({ where: { id } });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting blog");
  }
};

// Render update blog page
exports.renderUpdateBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).send("Blog not found");
    res.render("updateBlog", { blog });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading update page");
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
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
};
