const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: "bank" },
    note: { type: String, default: "" },
    total: Number,
    discount: Number,
    totalprice: Number,
    code: { type: String, default: "" },
    slip: String,
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "address" },
    products: Array,
    orderStatus: { type: Number, default: 0 },
    paidStatus: { type: Number, default: 0 },
    confirmStatus: { type: Number, default: 1 },
  },
  { timestamps: true, versionKey: false }
);

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
