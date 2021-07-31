const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    code: String,
    action: Number,
    percentSale: Number,
    priceSale: Number,
    productAvaliable: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    couponLimit: Number,
  },
  { timestamps: true, versionKey: false }
);

const CouponModel = mongoose.model("coupon", couponSchema);

module.exports = CouponModel;
