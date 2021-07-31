const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoriesSchema = new Schema(
  {
    categoriesName: String,
  },
  { timestamps: true, versionKey: false }
);

const CategoriesModel = mongoose.model("categories", categoriesSchema);

module.exports = CategoriesModel;
