const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const aboutSchema = Schema(
  {
    title: String,
    detail: String,
    image: String,
    status: { type: Number, default: 1 } ,
  },
  { timestamps: true, versionKey: false }
);

const aboutModel = mongoose.model("about", aboutSchema);

module.exports = aboutModel;
