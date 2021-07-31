const express = require("express");
const route = express.Router();

const {
  upload,
  create,
  getProductall,
  getProductWithId,
  deleteProduct,
  increaseImage,
  deleteImage,
  updateProductWithId,
  getnewProduct,
  getPopularProduct,
  getProductSortPrice,
} = require("../controller/product");

route.use(express.static("public"));
route.use("/uploads", express.static("uploads"));
route.get("/product", getProductall);
route.post("/product", upload.array("images"), create); //create and upload image
route.get("/product/:id", getProductWithId);
route.delete("/product", deleteProduct);
route.post("/product/image", upload.single("image"), increaseImage); //เพิ่มรูปภาพ
route.delete("/product/image/:id", deleteImage);
route.put("/product/:id", updateProductWithId);

/* customer */ getPopularProduct;
route.get("/customer/product/", getnewProduct);
route.get("/customer/product/popular", getPopularProduct);
route.get("/customer/product/sort/:type/:price", getProductSortPrice);

/*  */
module.exports = route;
