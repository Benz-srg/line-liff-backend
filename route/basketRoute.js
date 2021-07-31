const express = require("express");
const route = express.Router();
const {
  getBasket,
  createBasket,
  deleteBasket,
  deleteBasketMany,
  updateDecrease,
  updateIncrease
} = require("../controller/basket");

route.get("/basket/:id", getBasket);
route.post("/basket", createBasket);
route.delete("/basket/:id", deleteBasket);
route.delete("/basket/many", deleteBasketMany);
route.put("/basket/increase/:id",updateIncrease)
route.put("/basket/decrease/:id",updateDecrease)


module.exports = route;
