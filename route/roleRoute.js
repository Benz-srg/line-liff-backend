const express = require("express");
const route = express.Router();

const {
  createRole,
  getAllRoles,
  deleteRole,
  getQueryRolePermission,
  updateRolePermission,
  getRolePermissionByName,
  getRolePermissionByUserId,
} = require("../controller/role");

route.post("/role", createRole);
route.get("/role", getAllRoles);
route.delete("/role", deleteRole);
route.get("/rolePermission/:roleId", getQueryRolePermission);
route.put("/updatePermission/:permissionId", updateRolePermission);
route.post("/getRoleByName/:roleName", getRolePermissionByName);
route.post("/getRoleById/:id", getRolePermissionByUserId);

module.exports = route;
