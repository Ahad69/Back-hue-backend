const { Schema, model } = require("mongoose");

const contactSchema = Schema(
  {
    text : { type: String },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = model("contactUs", contactSchema);
