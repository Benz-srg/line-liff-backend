const express = require("express");
const route = express.Router();
const {
  getCategories,
  createCategories,
  deleteCategories,
  updateCategories
} = require("../controller/categories");

route.get("/categories", getCategories);
route.post("/categories", createCategories);
route.put("/categories/:id", updateCategories)
route.delete("/categories/:id", deleteCategories);
module.exports = route;
