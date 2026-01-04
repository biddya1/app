const router = require("express").Router();
const { upload } = require("../middleware/multerConfig");
const { isAuthenticated } = require("../middleware/isAuthenticated");

// ✅ Import updated controller functions
const {
  renderHome,
  renderAddBlog,
  addBlog,
  renderSingleBlog,
  deleteBlog,
  renderUpdateBlog,
  updateBlog, // <-- lowercase, matches controller
} = require("../controller/blog/blogController");

// Homepage
router.get("/", renderHome);

// Add blog
router.get("/addblog", renderAddBlog);
router.post("/addblog", upload.single("image"), isAuthenticated, addBlog);

// Single blog page
router.get("/blog/:id", renderSingleBlog);

// Delete blog
router.get("/delete/:id", deleteBlog);

// Update blog page
router.get("/update/:id", renderUpdateBlog);

// Update blog POST
router.post("/update/:id", upload.single("image"), updateBlog); // <-- lowercase

module.exports = router;
