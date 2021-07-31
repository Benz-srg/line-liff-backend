const express = require("express");
const route = express.Router();

const {
  getCost,
  getShipping,
  settingShippingCost

} = require("../controller/shippingcost");

route.use(express.static("public"));

route.get("/shippingcost/getcost/:quantity", getCost);
route.get("/shippingcost/all", getShipping);
route.post("/shippingcost", settingShippingCost);
/*  */
module.exports = route;
