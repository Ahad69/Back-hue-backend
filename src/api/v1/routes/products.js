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
} = require("../product/controller");
const { updateApproveMany, deleteMany } = require("../product/service");

var allowlist = ['https://adbacklist-admin.vercel.app/', 'https://adbacklist-admin.vercel.app']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

const cors = require('cors');

router.post("/", cors(corsOptionsDelegate), verifyToken, addProduct);

router.patch("/:id", updateProduct);

router.get("/admin", verifyAdmin, getAdminPost);

router.patch("/approved/:id", verifyAdmin, updateApprove);

router.post("/many", updateApproveMany);

router.post("/deleteMany",  deleteMany);

router.get("/", getPosts);

router.get("/all", getAllPost);


router.delete("/:id", deleteProduct);

router.get("/search", searchProduct);

router.get("/:id", getProduct);

router.get("/posterid/:id", verifyToken, getPosterPost);
router.get("/admin-user/:id", getAdminPosterPost);

module.exports = router;
