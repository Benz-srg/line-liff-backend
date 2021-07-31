const bannerModel = require("../model/banner.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../uploads/banner"));
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({ storage: storage });

const increaseImage = async (req, res) => {
  const photo = req.file;
  if (photo) {
    const { filename } = photo;
    try {
      const newBanner = new bannerModel({ photo: filename });
      await newBanner.save(async (error, result) => {
        if (error) {
          res.status(400).json({ message: error });
        }
        const newPhotos = await bannerModel.find({});
        if (result) {
          res.json({
            status: 201,
            message: "อัพโหลดรูปภาพเรียบร้อย",
            photos: newPhotos,
          });
        } else {
          res.json({
            status: 400,
            message: "อัพโหลดรูปภาพล้มเหลว",
            photos: newPhotos,
          });
        }
      });
    } catch (error) {
      res.send(401).json({ message: error.message });
    }
  }
};

const getBanner = async (req, res) => {
  try {
    await bannerModel.find({}, (error, result) => {
      if (error) {
        res.json({ status: 400, message: "ไม่พบข้อมูล" });
      }
      res.json({ status: 200, photos: result });
    });
  } catch (error) {
    res.status(400).json({ message: "not found data.." });
  }
};

const decreaseImage = async (req, res) => {
  try {
    const deletePhotos = await bannerModel.findOne({ _id: req.params.id });
    await bannerModel.findOneAndDelete(
      { _id: req.params.id },
      async function (err, result) {
        if (err) {
          res
            .status(200)
            .json({ status: 400, message: "ลบรูปภาพล้มเหลว ลองใหม่อีกครั้ง" });
        }
        const newPhotos = await bannerModel.find({});
          fs.access(`uploads/banner/${deletePhotos.photo}`, fs.F_OK, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            fs.unlink(`uploads/banner/${deletePhotos.photo}`, (errImage) => {
              if (errImage) console.log(errImage);
            });
          });
          res.status(200).json({
            status: 200,
            message: "ลบรูปภาพเรียบร้อย",
            photos: newPhotos,
          });
      }
    );
  } catch (error) {
    res.status(400).json({ message: "not found data.." });
  }
};

module.exports = {
  upload,
  increaseImage,
  getBanner,
  decreaseImage,
};
