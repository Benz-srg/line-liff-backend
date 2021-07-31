const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = Schema(
  {
    liffId: String,
    liffName:{ type: String, default: "" },
    fullName: { type: String, default: "" },
    role: { type: String, default: "customer" },
    email: { type: String, default: "" },
    tel: { type: String, default: "" },
    age: { type: String, default: 1 },
    sex: { type: String, default: "" },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
        default: "",
      },
    ],
    billingAddress: { type: String, default: "" },
    shippingAddress: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

const customerModel = mongoose.model("customer", customerSchema);

module.exports = customerModel;
