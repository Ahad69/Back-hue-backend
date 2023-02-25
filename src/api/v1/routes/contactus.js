const express = require("express");
const { addAbout , getAbout , updateAbouts } = require("../contactus/controllers");
const verifyAdmin = require("../middleware/adminCheck");
const router = express.Router();



router.post("/", verifyAdmin , addAbout);
router.get("/" ,  getAbout);
router.patch("/:id", verifyAdmin , updateAbouts);
// router.delete("/:id", verifyAdmin , deleteReport);

module.exports = router;