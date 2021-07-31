const express = require("express");
const route = express.Router();
const {
  getCustomer,
  createCustomer,
  updateCustomer,
  getCustomerId,
  deleteCustomer
} = require("../controller/customer");

route.get("/customer", getCustomer);
route.post("/customer", createCustomer);
route.put("/customer/:id", updateCustomer);
route.get("/customer/:id", getCustomerId)
route.delete("/customer", deleteCustomer);
module.exports = route;
