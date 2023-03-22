const { Schema, model } = require("mongoose");
const mongoose = require('mongoose');

const transactionSchema = Schema(
  {
    isCompleted : { type: String, default: "pending" },
    date : { type : String },
    invoice : { type: String, trim: true },
    amount : {type: Number},
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    email : {type: String , trim: true},
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = model("transaction", transactionSchema);