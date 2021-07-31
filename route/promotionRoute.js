const express = require("express");
const route = express.Router();

const promotionController = require("../controller/promotion.controller");

route.get("/promotion", promotionController.getPromotion);
route.post(
  "/promotion",
  promotionController.upload.single("photo"),
  promotionController.createPromotion
);

module.exports = route;
