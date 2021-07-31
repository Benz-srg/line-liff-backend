const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promotionSchema = Schema(
  {
    photo: String,
    statusPromotion: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const promotionModel = mongoose.model("promotion", promotionSchema);

module.exports = promotionModel;
