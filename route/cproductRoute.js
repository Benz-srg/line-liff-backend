const express = require("express");
const route = express.Router();

const {
  upload,
  create,
  getProductall,
  getProductWithId,
  deleteProduct,
} = require("../controller/product");

route.use(express.static("public"));
//route.use("/uploads", express.static("uploads"));
route.get("/customerproduct", getProductall);
route.get("/customerproduct/:id", getProductWithId);
/* route.post("/product", upload.array("images"), create); //create and upload image

route.delete("/product", deleteProduct); */

module.exports = route;
