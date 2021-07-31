const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const allbankSchema = Schema(
  {
    allbankId: [{ type: String }],
    bankId: [
      {
        type: String,
        unique: true,
      },
    ],
    bankName: String,
  },
  { timestamps: true, versionKey: false }
);

const allbankModel = mongoose.model("allbank", allbankSchema);

module.exports = allbankModel;
