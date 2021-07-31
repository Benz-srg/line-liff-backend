const customer = require("../model/customer");

const getCustomer = async (req, res) => {
  const result = await customer.find({}).populate("address");
  //   const products = await product.find({});
  res.json({ status: 200, customers: result });
};
const getCustomerId = async (req, res) => {
  const { id } = req.params;
  try {
    await customer
      .findById(id, async (err, result) => {
        if (err) console.log(err);
        if (result) {
          res
            .json({
              status: 201,
              customers: result,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              customers: [],
            })
            .end();
        }
      })
      .populate("address");
  } catch (error) {
    console.log(error);
  }
};

const createCustomer = async (req, res) => {
  await customer.findOne(
    { liffId: req.body.liffId },
    async function (err, result) {
      if (result) {
        res
          .json({
            status: 201,
            message: "Login success",
            customers: result,
          })
          .end();
      } else {
        if (req.body.liffId) {
          const insert = new customer(req.body);
          await insert.save(async (err, resultInsert) => {
            if (err) console.log(err);
            const selectCustomers = await customer.findOne({
              liffId: req.body.liffId,
            });
            console.log(selectCustomers, "selectCustomers logging");
            if (resultInsert) {
              res
                .json({
                  status: 201,
                  message: "บันทึกข้อมูลลูกค้าเรียบร้อย",
                  customers: selectCustomers,
                })
                .end();
            } else {
              res
                .json({
                  status: 401,
                  message: "บันทึกข้อมูลลูกค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
                  customers: selectCustomers,
                })
                .end();
            }
          });
        } else {
          res
            .json({
              status: 401,
              message: "บันทึกข้อมูลลูกค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
              customers: selectCustomers,
            })
            .end();
        }
      }
    }
  );
};

const updateCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    await customer.findByIdAndUpdate(
      id,
      { $set: req.body },
      async (err, result) => {
        if (err) console.log(err);
        const updateresult = await customer.findById(result._id);
        if (result._id) {
          res
            .json({
              status: 201,
              message: "แก้ไขข้อมูลลูกค้าเรียบร้อย",
              customers: updateresult,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              message: "แก้ไขข้อมูลลูกค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
              customers: updateresult,
            })
            .end();
        }
      }
    );
  } catch (error) {}
};
const updateByCustomer = async (req, res) => {
  const { id } = req.param;
  let { fullName, age, tel, email, sex } = req.body;
  try {
    await customer.findByIdAndUpdate(
      { _id: id },
      {
        fullName: fullName,
        age: age,
        tel: tel,
        email: email,
        sex: sex,
      },
      async (err, result) => {
        if (result._id) {
          res
            .json({
              status: 201,
              message: "แก้ไขข้อมูลลูกค้าเรียบร้อย",
              customers: updateresult,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              message: "แก้ไขข้อมูลลูกค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
              customers: updateresult,
            })
            .end();
        }
      }
    );
  } catch (e) {
    console.log(e);
  } finally {
  }
};
const deleteCustomer = async (req, res) => {
  const { id } = req.body; //get ids array in object id
  await customer.deleteMany({ _id: { $in: id } }, async function (err, result) {
    if (err) throw err;
    if (result) {
      const customers = await customer.find({}).populate("categoriesId");
      res.status(201).json({
        status: 201,
        message: "ลบข้อมูลรายการสินค้าเรียบร้อย",
        customers: customers,
      });
    } else {
      res.status(401).json({
        status: 401,
        message: "ลบข้อมูลรายการสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
      });
    }
  });
};

module.exports = {
  getCustomer,
  createCustomer,
  updateCustomer,
  getCustomerId,
  deleteCustomer,
};
