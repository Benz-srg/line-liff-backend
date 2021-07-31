const express = require("express");
const route = express.Router();
const {
  getBanks,
  createBank,
  updateBank,
  deleteBank,
} = require("../controller/bank");

route.get("/bank", getBanks);
route.post("/bank", createBank);
route.put("/bank/:id", updateBank);
route.delete("/bank", deleteBank);

module.exports = route
