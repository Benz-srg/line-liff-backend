const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    addressName: String,
    phoneNumber: String,
    shippingAddress: String,
    addressStatus: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

const addressModel = mongoose.model("address", addressSchema);

module.exports = addressModel;
