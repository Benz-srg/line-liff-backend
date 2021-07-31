const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const relationsSchema = Schema(
  {
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "product", sparse: true },
    ],
  },
  { timestamps: true, versionKey: false }
);

const relationsModel = mongoose.model("relationsProduct", relationsSchema);

module.exports = relationsModel;
