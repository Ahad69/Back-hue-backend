const express = require("express");
const { addTransaction , deleteTransaction , getTransaction , updateTransactions  } = require("../transaction/controllers");
const verifyAdmin = require("../middleware/adminCheck");
const router = express.Router();



router.post("/", addTransaction);
router.get("/"  , getTransaction);
router.patch("/:id", verifyAdmin , updateTransactions);
router.delete("/:id", verifyAdmin , deleteTransaction);

module.exports = router;
