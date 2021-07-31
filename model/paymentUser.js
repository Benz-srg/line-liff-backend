const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentUserSchema = Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
     bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "allbank",
    },
    bankAccNo: String,
    bankAccName: String,
    paymentStatus: { type: Number, default: 0 } ,
  },
  { timestamps: true, versionKey: false }
);

const paymentUserModel = mongoose.model("paymentUser", paymentUserSchema);

module.exports = paymentUserModel;
