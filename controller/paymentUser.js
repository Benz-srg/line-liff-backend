const paymentUser = require("../model/paymentUser");
const Customer = require("../model/customer");

const getpaymentUser = async (req, res) => {
  const { id } = req.params;
  try {
    const paymentUsers = await paymentUser
      .find({
        $and: [
          { $or: [{ customerId: req.body.customerId }] },
          { $or: [{ paymentStatus: 1 }, { paymentStatus: 0 }] },
        ],
      })
      .populate("bankId");
    res.json({ status: 200, payments: paymentUsers });
  } catch (error) {
    console.log(error);
  }
};
const createpaymentUser = async (req, res) => {
  
  const Addpayment = new paymentUser(req.body);
  await Addpayment.save(async (err, resultInsert) => {
    await Customer.findByIdAndUpdate(req.body.customerId, {
      $push: { payment: resultInsert._id },
      $set: { paymentSelect: resultInsert._id },
    });
    if (err) throw err;
    const paymentUsers = await paymentUser.find({
      $and: [
        { $or: [{ customerId: req.body.customerId }] },
        { $or: [{ paymentStatus: 1 }, { paymentStatus: 0 }] },
      ],
    });
    if (resultInsert._id) {
      res
        .json({
          status: 201,
          message: "บันทึกข้อมูลการชำระเงินเรียบร้อย",
          payments: paymentUsers,
        })
        .end();
    } else {
      res
        .json({
          status: 401,
          message: "บันทึกข้อมูลการชำระเงินล้มเหลว กรุณาลองใหม่อีกครั้ง",
          payments: paymentUsers,
        })
        .end();
    }
  });
};

const deleteStatuspaymentUser = async (req, res) => {
  const { id } = req.params;
  try {
    await paymentUser.findByIdAndUpdate(
      id,
      { $set: req.body },
      async (err, result) => {
        if (err) console.log(err);
        if (req.body.paymentStatus == 1) {
          await paymentUser.updateMany(
            {
              $and: [
                { $or: [{ customerId: result.customerId }] },
                { $or: [{ paymentStatus: 1 }, { paymentStatus: 0 }] },
                { _id: { $ne: id } },
              ],
            },
            { $set: { paymentStatus: 0 } }
          );
        }
        const updateresult = await paymentUser.find({
          $and: [
            { $or: [{ customerId: result.customerId }] },
            { $or: [{ paymentStatus: 1 }, { paymentStatus: 0 }] },
          ],
        });
        if (result._id) {
          if (req.body.paymentStatus == 3) {
            await Customer.findByIdAndUpdate(result.customerId, {
              $pull: { payment: result._id },
            });
            res
              .json({
                status: 201,
                message: "ลบข้อมูลการชำระเงินเรียบร้อย",
                payments: updateresult,
              })
              .end();
          } else if (req.body.paymentStatus == 1) {
            res
              .json({
                status: 201,
                message: "เลือกบัญชีชำระเงินเรียบร้อย",
                payments: updateresult,
              })
              .end();
          }
        } else {
          if (req.body.paymentStatus == 3) {
            res
              .json({
                status: 401,
                message: "ลบข้อมูลการชำระเงินล้มเหลว กรุณาลองใหม่อีกครั้ง",
                payments: updateresult,
              })
              .end();
          } else if (req.body.paymentStatus == 1) {
            res
              .json({
                status: 401,
                message: "เลือกชำระเงินล้มเหลว กรุณาลองใหม่อีกครั้ง",
                payments: updateresult,
              })
              .end();
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const updatepaymentUser = async (req, res) => {
  const { id } = req.params;
  try {
    await paymentUser.findByIdAndUpdate(
      id,
      { $set: req.body },
      async (err, result) => {
        if (err) console.log(err);
        const updateresult = await paymentUser.find({
          $and: [
            { $or: [{ customerId: result.customerId }] },
            { $or: [{ paymentStatus: 1 }, { paymentStatus: 0 }] },
          ],
        });
        if (result._id) {
          res
            .json({
              status: 201,
              message: "แก้ไขข้อมูลบํญชีชำระเงินเรียบร้อย",
              payments: updateresult,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              message: "แก้ไขข้อมูลบํญชีชำระเงินล้มเหลว กรุณาลองใหม่อีกครั้ง",
              payments: updateresult,
            })
            .end();
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const deletepaymentUser = async (req, res) => {
  const { id } = req.body;
  await paymentUser.findByIdAndDelete(id, async function (err, result) {
    if (err) console.log(err);
    const updateresult = await paymentUser.find({});
    if (result !== null) {
      console.log(updateresult)
      res
        .json({
          status: 200,
          message: "ลบข้อมูลประเภทสินค้าเรียบร้อย",
          payments: updateresult,
        })
        .end();
    } else {
      console.log(updateresult)
      res
        .json({
          status: 401,
          message: "ลบข้อมูลประเภทสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
          payments: updateresult,
        })
        .end();
    }
  });
};

module.exports = {
  getpaymentUser,
  createpaymentUser,
  updatepaymentUser,
  deleteStatuspaymentUser,
  deletepaymentUser,
};
