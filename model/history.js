const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: "bank" },
    note: String,
    total: Number,
    discount: Number,
    totalprice: Number,
    code: String,
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "address" },
    products: Array,
    orderStatus: Number,
    paidStatus: Number,
    confirmStatus: { type: Number, default: 1 },
    tackingNo: { type: String, default: "" },
    shippingName: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

const historyModel = mongoose.model("history", historySchema);

module.exports = historyModel;
