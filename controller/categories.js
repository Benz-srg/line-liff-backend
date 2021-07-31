const categories = require("../model/categories");
const product = require("../model/product");

const getCategories = async (req, res) => {
  const result = await categories.find({});
  const products = await product.find({});
  res.json({ status: 200, categories: result, products: products });
};

const createCategories = async (req, res) => {
  const categoriesExsit = await categories.findOne({
    categoriesName: req.body.categoriesName,
  });
  if (categoriesExsit) {
    const result = await categories.find({});
    res
      .json({
        status: 401,
        message: "บันทึกข้อมูลประเภทสินค้าล้มเหลว เนื่องจากรายการซ้ำ",
        categories: result,
      })
      .end();
    return;
  }
  const insert = new categories(req.body);
  await insert.save(async (err, resultInsert) => {
    if (err) console.log(err);
    const result = await categories.find({});
    if (resultInsert) {
      res
        .json({
          status: 201,
          message: "บันทึกข้อมูลประเภทสินค้าเรียบร้อย",
          categories: result,
        })
        .end();
    } else {
      res
        .json({
          status: 401,
          message: "บันทึกข้อมูลประเภทสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
          categories: result,
        })
        .end();
    }
  });
};

const updateCategories = async (req, res) => {
  const { id } = req.params;
  try {
    await categories.findByIdAndUpdate(
      id,
      { $set: req.body },
      async (err, result) => {
        if (err) console.log(err);
        const updateresult = await categories.find({});
        if (result._id) {
          res
            .json({
              status: 201,
              message: "แก้ไขข้อมูลประเภทสินค้าเรียบร้อย",
              categories: updateresult,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              message: "แก้ไขข้อมูลประเภทสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
              categories: updateresult,
            })
            .end();
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const deleteCategories = async (req, res) => {
  const { id } = req.params;
  await product.updateMany(
    { categoriesId: id },
    { $set: { categoriesId: "60fe5ad3d09ecb0015939779" } },
    async function (error, result) {
      if (error) console.log(error);
      await categories.findByIdAndDelete(id, async function (err, result) {
        if (err) console.log(err);
        const updateresult = await categories.find({});
        if (result != null) {
          res
            .json({
              status: 200,
              message: "ลบข้อมูลประเภทสินค้าเรียบร้อย",
              categories: updateresult,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              message: "ลบข้อมูลประเภทสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
              categories: updateresult,
            })
            .end();
        }
      });
    }
  );
};

module.exports = {
  getCategories,
  createCategories,
  deleteCategories,
  updateCategories,
};
