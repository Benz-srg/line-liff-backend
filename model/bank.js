const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankSchema = Schema(
  {
    account:String,
    bankName:String,
    bankAccountName:String
  },
  { timestamps: true, versionKey: false }
);

const bankModel = mongoose.model("bank", bankSchema);

module.exports = bankModel;
