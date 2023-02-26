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
} = require("../product/controller");
const { updateApproveMany } = require("../product/service");

router.post("/", verifyToken, addProduct);

router.patch("/:id", updateProduct);

router.get("/admin", verifyAdmin, getAdminPost);

router.patch("/approved/:id", verifyAdmin, updateApprove);

router.post("/many", updateApproveMany);

router.get("/", getPosts);




router.delete("/:id", deleteProduct);

router.get("/search", searchProduct);

router.get("/:id", getProduct);

router.get("/posterid/:id", verifyToken, getPosterPost);

module.exports = router;
