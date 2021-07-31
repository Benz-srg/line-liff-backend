const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchme = Schema(
  {
    wishlistId: Number,
    customerId: mongoose.Schema.Types.ObjectId("customer"),
    wishlistItems: Array,
  },
  { timestamps: true, versionKey: false }
);

const wishlistModel = mongoose.model("wishlist", wishlistSchme);

module.exports = wishlistModel;
