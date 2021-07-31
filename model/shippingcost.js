const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shippingSchema = Schema(
  {
    firstCost: Number,
    anyCost: Number,
    fixedCost: Number,
    //status
    // 0 : ค่าส่งแบบเท่ากัน
    // 1 : รูปแบบค่าจะส่งแบบ ชิ้นแรกเท่าไหร่ ชิ้นต่อไปเท่าไหร่
    status: { type: Number, default: 0 } ,
  },
  { timestamps: true, versionKey: false }
);

const shippingCostModel = mongoose.model("shippingCost", shippingSchema);
module.exports = shippingCostModel;