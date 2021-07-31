const express = require("express");
const route = express.Router();

const {
  upload,
  create,
  getAboutall,
  getAboutWithId,
  deleteAbout,
  increaseImage,
  deleteImage,
  updateAboutWithId,
  getnewAbout,
  getPopularAbout,
  getAboutSortPrice,
} = require("../controller/about");

route.use(express.static("public"));
route.use("/uploads", express.static("uploads"));
route.get("/about", getAboutall);
route.post("/about", upload.single("image"), create); //create and upload image
route.get("/about/:id", getAboutWithId);
route.delete("/about", deleteAbout);
route.post("/about/image", upload.single("image"), increaseImage); //เพิ่มรูปภาพ
route.delete("/about/image/:id", deleteImage);
route.put("/about/:id",  upload.single("image"), updateAboutWithId);

/* customer */ getPopularAbout;
route.get("/customer/about/", getnewAbout);
route.get("/customer/about/popular", getPopularAbout);
route.get("/customer/about/sort/:type/:price", getAboutSortPrice);

/*  */
module.exports = route;
