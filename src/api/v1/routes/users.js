const express = require("express");
const { addUser, getUser, getUsers , updateUser , deleteUser , updateUserAddress  } = require("../users/controller");
const { addUserService , getUsersService , signinUsers } = require("../users/services");
const verifyToken = require("../middleware/checkLogin");
const verifyAdmin = require("../middleware/adminCheck");

const router = express.Router();

router.post("/", addUserService);
router.post("/login", signinUsers);
router.get("/", verifyToken,  getUsersService);


router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.patch("/address/:id", updateUserAddress);
router.delete("/:id", verifyAdmin, deleteUser);

module.exports = router;
