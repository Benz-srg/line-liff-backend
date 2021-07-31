const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = Schema(
  {
    userName: String,
    passWord: String,
    fullName: String,
    role: String,
    email: String,
    tel: Number,
  },
  { timestamps: true, versionKey: false }
);

const adminModel = mongoose.model("admin", adminSchema);

module.exports = adminModel;
