const { Schema, model } = require("mongoose");

const reportsSchema = Schema(
  {
    text : { type: String },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = model("aboutUs", reportsSchema);
