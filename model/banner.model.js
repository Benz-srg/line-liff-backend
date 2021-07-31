const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bannerSchema = Schema(
  {
    photo: String,
  },
  { timestamps: true, versionKey: false }
);

const bannerModel = mongoose.model("banner", bannerSchema);

module.exports = bannerModel;
