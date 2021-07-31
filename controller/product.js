const product = require("../model/product");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
/*  */
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

const getRelations = async (arrayId) => {
  const newReleted = await product.find({
    _id: { $in: arrayId },
  });
  return newReleted;
};

const getProductall = async (req, res) => {
  const products = await product
    .find()
    .populate("categoriesId")
    .exec(async function (err, results) {
      res.json({ status: 200, data: results });
    });
};

const create = async (req, res) => {
  let newProduct = req.body;
  if (newProduct.relatedIds == "") {
    delete newProduct.relatedIds;
  } else if (newProduct.relatedIds.length > 0) {
    const reulstRelations = await getRelations(req.body.relatedIds);
    newProduct.relatedProducts = reulstRelations;
  }

  const arImage = req.files;
  const photos = [];
  for (const img of arImage) {
    photos.push(img.filename);
  }
  newProduct.images = photos;
  const insert = new product(newProduct);
  await insert.save(async (err, resultProduct) => {
    if (err) console.log(err);
    if (resultProduct._id) {
      const products = await product.find({}).populate("categoriesId");
      res
        .json({
          status: 201,
          message: "บันทึกข้อมูลสินค้าเรียบร้อย",
          products: products,
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

const updateProductWithId = async (req, res) => {
  try {
    let newProduct = req.body;
    newProduct.description = JSON.stringify(req.body.description);
    delete newProduct.images;
    if (newProduct.relatedIds == "") {
      delete newProduct.relatedIds;
    } else if (newProduct.relatedIds.length > 0) {
      const reulstRelations = await getRelations(newProduct.relatedIds);
      newProduct.relatedProducts = reulstRelations;
    }
    const { id } = req.params;
    await product.findByIdAndUpdate(
      id,
      { $set: { ...newProduct } },
      async (err, result) => {
        if (err) throw err;
        if (result) {
          const products = await product
            .find({ _id: id })
            .populate("categoriesId");
          res
            .json({
              status: 201,
              message: "แก้ไขข้อมูลสินค้าเรียบร้อย",
              products: products,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              message: "แก้ไขข้อมูลสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
              products: products,
            })
            .end();
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const getProductWithId = async (req, res, next) => {
  const { id } = req.params;
  try {
    await product.findOne({ _id: id }, function (err, result) {
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

const deleteProduct = async (req, res) => {
  const { id } = req.body; //get ids array in object id
  await product.deleteMany({ _id: { $in: id } }, async function (err, result) {
    if (err) throw err;
    if (result) {
      const products = await product.find({}).populate("categoriesId");
      res.status(201).json({
        status: 201,
        message: "ลบข้อมูลรายการสินค้าเรียบร้อย",
        products: products,
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
      await product.updateOne(
        conditions,
        { $push: { images: filename } },
        async (err, updated) => {
          if (err) console.log(err);
          if (updated) {
            const products = await product
              .find({ _id: id })
              .populate("categoriesId");
            res.status(201).json({
              status: 201,
              message: "เพิ่มรูปภาพเรียบร้อย",
              products: products,
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
      await product.updateOne(
        { _id: id },
        { $pullAll: { images: [pathname] } },
        async (err, succuess) => {
          if (err) throw err;

          const queryProductId = await product.findOne({ _id: id });

          if (succuess) {
            fs.access(`uploads/${pathname}`, fs.F_OK, (err) => {
              if (err) {
                console.error(err);
                return;
              }
              fs.unlink(`uploads/${pathname}`, (errImage) => {
                if (errImage) console.log(errImage);
              });
            });

            res.json({
              status: 200,
              message: "ลบรูปภาพเรียบร้อย",
              products: [queryProductId],
            });
          } else {
            res.json({
              status: 401,
              message: "ลบรูปภาพ ล้มเหลวกรุณาลองใหม่อีกครั้ง",
              products: [queryProductId],
            });
          }
        }
      );
    } else {
      const queryProductId = await product.findOne({ _id: id });
      res.json({
        status: 401,
        message: "ลบรูปภาพ ล้มเหลวกรุณาลองใหม่อีกครั้ง",
        products: [queryProductId],
      });
    }
  } catch (error) {
    const queryProductId = await product.findOne({ _id: id });
    res.json({
      status: 401,
      message: "ลบรูปภาพ ล้มเหลวกรุณาลองใหม่อีกครั้ง",
      products: [queryProductId],
    });
  }
};

//สินค้าใหม่
const getnewProduct = async (req, res) => {
  try {
    await product
      .find({ statusNewProduct: 1 })
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

const getPopularProduct = async (req, res) => {
  try {
    await product.find({ ispopulated: 1 }).exec((err, result) => {
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

const getProductSortPrice = async (req, res) => {
  try {
    let objectSort;
    if (req.params.type == "newproduct") {
      await product
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
      await product
        .find(objectSort)
        .sort({ price: req.params.price })
        .exec((err, result) => {
          if (err) {
            res.json({ status: 402, data: [] });
          }

          res.json({ status: 200, data: result });
        });
    } else if (req.params.type == "normal") {
      await product
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
  getProductall,
  create,
  getProductWithId,
  deleteProduct,
  increaseImage,
  deleteImage,
  updateProductWithId,
  /* customer  */
  getnewProduct,
  getPopularProduct,
  getProductSortPrice,
};
