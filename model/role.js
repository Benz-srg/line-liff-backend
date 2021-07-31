const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = Schema(
  {
    roleName: { type: String, unique: true },
  },
  { timestamps: true, versionKey: false }
);

const roleModel = mongoose.model("role", roleSchema);

module.exports = roleModel;
