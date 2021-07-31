const express = require("express");
const route = express.Router();
const { getBaskets } = require("../controller/checkout");

route.post("/checkout", getBaskets);

module.exports = route;
