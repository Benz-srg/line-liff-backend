const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    sku: String,
    title: String,
    price: Number,
    saleprice: Number,
    quantity: Number,
    images: Array,
    categoriesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
    relatedIds: { type: Array, default: Array },
    ispopulated: Number,
    averageRating: Number,
    description: { type: String, default: "" },
    size: { type: Array, default: Array },
    statusNewProduct: { type: Number, default: 0 },
    relatedProducts: { type: Array, default: Array },
  },
  { timestamps: true, versionKey: false }
);

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;
