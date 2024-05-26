const express = require("express");
const {
  addDeposit,
  getDeposits,
  updateStatus,
} = require("../deposit/controller");

const router = express.Router();

router.post("/", addDeposit);
router.get("/", getDeposits);

router.patch("/:id", updateStatus);

module.exports = router;
