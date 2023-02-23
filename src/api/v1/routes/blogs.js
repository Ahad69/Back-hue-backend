const express = require("express");
const { addBlog, getBlog, updateBlogs, deleteBlog } = require("../Blogs/controllers");
const verifyAdmin = require("../middleware/adminCheck");
const router = express.Router();



router.post("/", verifyAdmin ,addBlog);
router.get("/" , getBlog);
router.patch("/:id",  verifyAdmin, updateBlogs);
router.delete("/:id", verifyAdmin , deleteBlog);

module.exports = router;
