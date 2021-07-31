const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = Schema(
  {
    id: { type: String, default: "" },
    size: { type: String, default: "" },
    title: String,
    price: Number,
    qty: Number,
    price_product: Number,
    historyId: { type: mongoose.Schema.Types.ObjectId, ref: "history" },
  },
  { timestamps: true, versionKey: false }
);

const historyModel = mongoose.model("historyitem", historySchema);

module.exports = historyModel;
