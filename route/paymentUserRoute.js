const express = require("express");
const route = express.Router();
const {
  getpaymentUser,
  createpaymentUser,
  updatepaymentUser,
  deleteStatuspaymentUser,
  deletepaymentUser,
} = require("../controller/paymentUser");

route.get("/paymentUser/all/:id", getpaymentUser);
route.post("/paymentUser", createpaymentUser);
route.put("/paymentUser/update/:id", updatepaymentUser);
route.put("/paymentUser/status/:id", deleteStatuspaymentUser);
route.delete("/paymentUser", deletepaymentUser);

module.exports = route
