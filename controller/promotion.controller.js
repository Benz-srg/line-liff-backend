const promotionModel = require("../model/promotion");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../uploads/promotion"));
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({ storage: storage });

const createPromotion = async (req, res) => {
  const namePhoto = req.file;
  try {
    if (namePhoto) {
      await promotionModel.find({}, async function (err, result) {
        if (err) {
          res.send(401);
        }
        if (result != "") {
          const { _id, photo } = result[0];
          fs.access(`uploads/promotion/${photo}`, fs.F_OK, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            fs.unlink(`uploads/promotion/${photo}`, (errImage) => {
              if (errImage) console.log(errImage);
            });
          });

          const condition = { _id: _id };
          const payload = {
            statusPromotion: req.body.statusPromotion,
            photo: namePhoto.filename,
          };

          await promotionModel.findOneAndUpdate(
            condition,
            payload,
            async function (err, updated) {
              if (err) res.send(401);
              const result = await promotionModel.find({});
              let photoObject = "";
              result.length > 0 ? (photoObject = result[0]) : "";
              res.json({
                status: 201,
                message: "บันทึกข้อมูลโปรโมชั่นเรียบร้อย",
                photo: photoObject,
              });
            }
          );
        } else {
          const payload = {
            statusPromotion: req.body.statusPromotion,
            photo: namePhoto.filename,
          };
          const insert = new promotionModel(payload);
          await insert.save(async (err, resultProduct) => {
            if (err) console.log(err);
            if (resultProduct._id) {
              res
                .json({
                  status: 201,
                  message: "บันทึกข้อมูลโปรโมชั่นเรียบร้อย",
                  photo: resultProduct,
                })
                .end();
            } else {
              res
                .json({
                  status: 400,
                  message: "บันทึกข้อมูลโปรโมชั่นล้มเหลว กรุณาลองใหม่อีกครั้ง",
                })
                .end();
            }
          });
        }
      });
    }
  } catch (error) {
    res.send(401);
  }
};

const getPromotion = async (req, res) => {
  try {
    await promotionModel.find({}, (err, result) => {
      if (err) {
        res.send(401);
      }
      let photoObject = "";
      result.length > 0 ? (photoObject = result[0]) : "";
      res.json({ status: 200, photo: photoObject });
    });
  } catch (error) {
    res.send(401);
  }
};

module.exports = {
  createPromotion,
  getPromotion,
  upload,
};
