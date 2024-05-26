const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const depositSchema = Schema(
  {
    userName: { type: String },
    userId: { type: String },
    email: { type: String },
    amount: { type: String },
    trxid: { type: String },
    status: { type: String },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("deposit", depositSchema);
