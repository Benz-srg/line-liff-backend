const express = require("express");
const route = express.Router();
const {
  getAddress,
  createAddress,
  updateAddress,
  deleteStatusAddress,
  deleteAddress,
} = require("../controller/address");

route.get("/address/all/:id", getAddress);
route.post("/address", createAddress);
route.put("/address/update/:id", updateAddress);
route.put("/address/status/:id", deleteStatusAddress);
route.delete("/address", deleteAddress);

module.exports = route;
