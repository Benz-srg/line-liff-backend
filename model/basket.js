const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const basketSchme = Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer"},
    price: Number,
    quantity: Number,
    size: String,
  },
  { timestamps: true, versionKey: false }
);

const basketModel = mongoose.model("basket", basketSchme);

module.exports = basketModel;
