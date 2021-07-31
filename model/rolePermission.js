const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rolePermissionSchema = Schema(
  {
    roleId: {
      type: String,
      unique: true,
    },
    permission: {
      type: Array,
    },
  },
  { timestamps: true, versionKey: false }
);

const rolePermissionModel = mongoose.model(
  "rolePermission",
  rolePermissionSchema
);

module.exports = rolePermissionModel;
