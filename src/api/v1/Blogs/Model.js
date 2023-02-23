const { Schema, model } = require("mongoose");

const blogSchema = Schema(
  {
    title: { type: String, trim: true },
    category: { type: String, trim: true },
    desc : { type: String },
    image : { type: String },
    writer : { type: String },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = model("blogs", blogSchema);
