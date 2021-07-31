const express = require("express");
const route = express.Router();
const {
  getAdmins,
  updateAdmin,
  deleteAdmin,
  queryAdminWithId,
} = require("../controller/admin");

const auth = require("../controller/auth.controller");

route.get("/admin", getAdmins);
route.get("/admin/:id", queryAdminWithId);
route.post("/admin", auth.signUpAdmin); //signup or create user admin
route.post("/admin/signin", auth.signInAdmin); //signin
route.put("/admin/:id", updateAdmin);
route.delete("/admin", deleteAdmin);

module.exports = route;
