const express = require("express");
const route = express.Router();
const {
  getAllBanks,
  createAllBank,
  deleteAllBank,
} = require("../controller/allbank");

route.get("/allbank", getAllBanks);
route.post("/allbank", createAllBank);
route.delete("/allbank", deleteAllBank);

module.exports = route
