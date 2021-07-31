const express = require("express");
const route = express.Router();
const bannerController = require("../controller/banner.controller");

route.get("/banner", bannerController.getBanner);
route.post(
  "/banner",
  bannerController.upload.single("photo"),
  bannerController.increaseImage
);
route.delete("/banner/:id", bannerController.decreaseImage);
module.exports = route;
