const router = require("express").Router();

const verifyAdmin = require("../middleware/adminCheck");
const verifyToken = require("../middleware/checkLogin");
const {
  addProduct,
  getProducts,
  searchProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  updatePremium,
  getPosterPost,
  getAdminPost,
  getPosts,
  updateApprove,
  updateManyById,
  getAllPost,
  getAdminPosterPost,
  getPostsSitemap,
} = require("../product/controller");
const { updateApproveMany, deleteMany } = require("../product/service");

router.post("/", verifyToken, addProduct);

router.patch("/:id", updateProduct);

router.get("/admin", verifyAdmin, getAdminPost);

router.get("/sitemap", getPostsSitemap);

router.patch("/approved/:id", verifyAdmin, updateApprove);

router.post("/many", updateApproveMany);

router.post("/deleteMany", deleteMany);

router.get("/", getPosts);

router.get("/all", getAllPost);

router.delete("/:id", deleteProduct);

router.get("/search", searchProduct);

router.get("/:id", getProduct);

router.get("/posterid/:id", verifyToken, getPosterPost);
router.get("/admin-user/:id", getAdminPosterPost);

module.exports = router;
