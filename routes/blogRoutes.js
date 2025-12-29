const router = require("express").Router();
const { upload } = require("../middleware/multerConfig");

const {
  renderHome,
  renderAddBlog,
  addBlog,
  renderSingleBlog,
  deleteBlog,
  renderUpdateBlog,
  UpdateBlog,
} = require("../controller/blog/blogController");

router.get("/", renderHome);

router.get("/addblog", renderAddBlog);
router.post("/addblog", upload.single("image"), addBlog);

router.get("/blog/:id", renderSingleBlog);

router.get("/delete/:id", deleteBlog);

router.get("/update/:id", renderUpdateBlog);
router.post("/update/:id", upload.single("image"), UpdateBlog);

module.exports = router;
