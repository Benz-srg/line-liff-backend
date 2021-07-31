const about = require("../model/about");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
/*  */
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../uploads/aboutus/"));
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

const getRelations = async (arrayId) => {
  const newReleted = await about.find({
    _id: { $in: arrayId },
  });
  return newReleted;
};

const getAboutall = async (req, res) => {
  const abouts = await about.find().exec(async function (err, results) {
    res.json({ status: 200, data: results });
  });
};

const create = async (req, res) => {
  let newAbout = req.body;
  console.log(newAbout);
  console.log(req.file);
  const img = req.file;
  newAbout.image = img.filename;
  const insert = new about(newAbout);
  await insert.save(async (err, result) => {
    if (err) console.log(err);
    if (result._id) {
      const abouts = await about.find({});
      res
        .json({
          status: 201,
          message: "บันทึกข้อมูลสินค้าเรียบร้อย",
          abouts: abouts,
        })
        .end();
    } else {
      res
        .json({
          status: 200,
          message: "บันทึกข้อมูลสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
        })
        .end();
    }
  });
};

const updateAboutWithId = async (req, res) => {
  try {
    const { id } = req.params;
    let newAbout = req.body;
    const deletePhoto = await about.findOne({ _id: id });
    console.log("-----body-----");
    console.log(req.body);
    console.log("-----file-----");
    console.log(req.file);
    console.log("-----old-----");
    console.log(deletePhoto);
    if (req.file) {
      const img = req.file;
      newAbout.image = img.filename;
      fs.unlink(`uploads/aboutus/${deletePhoto.image}`, (errImage) => {
        if (errImage) throw errImage;
      });
    }

    await about.findByIdAndUpdate(
      id,
      { $set: { ...newAbout } },
      async (err, result) => {
        if (err) throw err;
        if (result) {
          const abouts = await about.find({ _id: id });
          res
            .json({
              status: 201,
              message: "แก้ไขข้อมูลบทความเรียบร้อย",
              abouts: abouts,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              message: "แก้ไขข้อมูลบทความล้มเหลว กรุณาลองใหม่อีกครั้ง",
              abouts: abouts,
            })
            .end();
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const getAboutWithId = async (req, res, next) => {
  const { id } = req.params;
  try {
    await about.findOne({ _id: id }, function (err, result) {
      if (err) console.log(err);
      if (result) {
        res.json({ status: 200, data: result });
      } else {
        res.json({
          status: 401,
          data: [],
          message: "ไม่พบข้อมูล รายการสินค้า",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteAbout = async (req, res) => {
  const { id } = req.body; //get ids array in object id
  const deletePhoto = await about.findOne({ _id: id });
  console.log(req.body);
  fs.unlink(`uploads/aboutus/${deletePhoto.image}`, (errImage) => {
    if (errImage) throw errImage;
  });
  await about.deleteMany({ _id: { $in: id } }, async function (err, result) {
    if (err) throw err;
    if (result) {
      const abouts = await about.find({});
      res.status(201).json({
        status: 201,
        message: "ลบข้อมูลรายการสินค้าเรียบร้อย",
        abouts: abouts,
      });
    } else {
      res.status(401).json({
        status: 401,
        message: "ลบข้อมูลรายการสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
      });
    }
  });
};

const increaseImage = async (req, res) => {
  const { id } = req.body;
  const photo = req.file;
  if (photo) {
    const { filename } = photo;
    try {
      var conditions = {
        _id: id,
        images: { $ne: filename },
      };
      await about.updateOne(
        conditions,
        { $push: { images: filename } },
        async (err, updated) => {
          if (err) console.log(err);
          if (updated) {
            const abouts = await about
              .find({ _id: id })
              .populate("categoriesId");
            res.status(201).json({
              status: 201,
              message: "เพิ่มรูปภาพเรียบร้อย",
              abouts: abouts,
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { pathname } = req.body;
    if (pathname) {
      await about.updateOne(
        { _id: id },
        { $pullAll: { images: [pathname] } },
        async (err, succuess) => {
          if (err) throw err;

          const queryAboutId = await about.findOne({ _id: id });

          if (succuess) {
            fs.unlink(`uploads/aboutus/${pathname}`, (errImage) => {
              if (errImage) throw errImage;
              checkStatus = true;
            });
            res.json({
              status: 200,
              message: "ลบรูปภาพเรียบร้อย",
              abouts: [queryAboutId],
            });
          } else {
            res.json({
              status: 401,
              message: "ลบรูปภาพ ล้มเหลวกรุณาลองใหม่อีกครั้ง",
              abouts: [queryAboutId],
            });
          }
        }
      );
    } else {
      const queryAboutId = await about.findOne({ _id: id });
      res.json({
        status: 401,
        message: "ลบรูปภาพ ล้มเหลวกรุณาลองใหม่อีกครั้ง",
        abouts: [queryAboutId],
      });
    }
  } catch (error) {
    const queryAboutId = await about.findOne({ _id: id });
    res.json({
      status: 401,
      message: "ลบรูปภาพ ล้มเหลวกรุณาลองใหม่อีกครั้ง",
      abouts: [queryAboutId],
    });
  }
};

//สินค้าใหม่
const getnewAbout = async (req, res) => {
  try {
    await about
      .find({})
      .sort({ createdAt: -1 })
      .exec((err, result) => {
        if (err) {
          res.json({ status: 402, data: [] });
        }

        res.json({ status: 200, data: result });
      });
  } catch (error) {
    console.log(error);
    res.json({ status: 401, data: [] });
  }
};

const getPopularAbout = async (req, res) => {
  try {
    await about.find({ ispopulated: 1 }).exec((err, result) => {
      if (err) {
        res.json({ status: 402, data: [] });
      }

      res.json({ status: 200, data: result });
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 401, data: [] });
  }
};

const getAboutSortPrice = async (req, res) => {
  try {
    let objectSort;
    if (req.params.type == "newAbout") {
      await about
        .find({})
        .sort({ price: req.params.price, createdAt: 1 })
        .exec((err, result) => {
          if (err) {
            res.json({ status: 402, data: [] });
          }

          res.json({ status: 200, data: result });
        });
    } else if (req.params.type == "popular") {
      objectSort = { ispopulated: 1 };
      await about
        .find(objectSort)
        .sort({ price: req.params.price })
        .exec((err, result) => {
          if (err) {
            res.json({ status: 402, data: [] });
          }

          res.json({ status: 200, data: result });
        });
    } else if (req.params.type == "normal") {
      await about
        .find({})
        .sort({ price: req.params.price })
        .exec((err, result) => {
          if (err) {
            res.json({ status: 402, data: [] });
          }

          res.json({ status: 200, data: result });
        });
    }
  } catch (error) {
    console.log(error);
    res.json({ status: 401, data: [] });
  }
};

module.exports = {
  upload,
  getAboutall,
  create,
  getAboutWithId,
  deleteAbout,
  increaseImage,
  deleteImage,
  updateAboutWithId,
  /* customer  */
  getnewAbout,
  getPopularAbout,
  getAboutSortPrice,
};
