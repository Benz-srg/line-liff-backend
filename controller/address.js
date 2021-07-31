const Address = require("../model/address");
const Customer = require("../model/customer");

const getAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const address = await Address.find({
      $and: [
        { $or: [{ customerId: id }] },
        { $or: [{ addressStatus: 1 }, { addressStatus: 0 }] },
      ],
    }).populate("bankId");
    res.json({ status: 200, addresses: address });
  } catch (error) {
    console.log(error);
  }
};
const createAddress = async (req, res) => {
  const AddAddress = new Address(req.body);
  await AddAddress.save(async (err, resultInsert) => {
    await Customer.findByIdAndUpdate(req.body.customerId, {
      $push: { address: resultInsert._id },
      $set: { shippingAddress: resultInsert._id },
    });
    if (err) throw err;
    const resultAfterInsert = await Address.find({
      $and: [
        { $or: [{ customerId: req.body.customerId }] },
        { $or: [{ addressStatus: 1 }, { addressStatus: 0 }] },
      ],
    });
    if (resultInsert._id) {
      res
        .json({
          status: 201,
          message: "เพิ่มข้อมูลที่อยู่เรียบร้อย",
          addresses: resultAfterInsert,
        })
        .end();
    } else {
      res
        .json({
          status: 401,
          message: "เพิ่มข้อมูลที่อยู่ล้มเหลว กรุณาลองใหม่อีกครั้ง",
          addresses: resultAfterInsert,
        })
        .end();
    }
  });
};
const deleteStatusAddress = async (req, res) => {
  const { id } = req.params;
  try {
    await Address.findByIdAndUpdate(
      id,
      { $set: req.body },
      async (err, result) => {
        if (err) console.log(err);
        if (req.body.addressStatus == 1) {
          await Customer.findByIdAndUpdate(result.customerId, {
            $set: { shippingAddress: id },
          });
          await Address.updateMany(
            {
              $and: [
                { $or: [{ customerId: result.customerId }] },
                { $or: [{ addressStatus: 1 }, { addressStatus: 0 }] },
                { _id: { $ne: id } },
              ],
            },
            { $set: { addressStatus: 0 } }
          );
        }
        const updateresult = await Address.find({
          $and: [
            { $or: [{ customerId: result.customerId }] },
            { $or: [{ addressStatus: 1 }, { addressStatus: 0 }] },
          ],
        });
        if (result._id) {
          if (req.body.addressStatus == 3) {
            await Customer.findByIdAndUpdate(result.customerId, {
              $pull: { address: result._id },
            });
            res
              .json({
                status: 201,
                message: "ลบข้อมูลที่อยู่เรียบร้อย",
                addresses: updateresult,
              })
              .end();
          } else if (req.body.addressStatus == 1) {
            res
              .json({
                status: 201,
                message: "เลือกที่อยู่เรียบร้อย",
                addresses: updateresult,
              })
              .end();
          }
        } else {
          if (req.body.addressStatus == 3) {
            res
              .json({
                status: 401,
                message: "ลบข้อมูลที่อยู่ล้มเหลว กรุณาลองใหม่อีกครั้ง",
                addresses: updateresult,
              })
              .end();
          } else if (req.body.addressStatus == 1) {
            res
              .json({
                status: 401,
                message: "เลือกชำระเงินล้มเหลว กรุณาลองใหม่อีกครั้ง",
                addresses: updateresult,
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

const updateAddress = async (req, res) => {
  const { id } = req.params;

  try {
    await Address.findByIdAndUpdate(
      id,
      { $set: req.body },
      async (err, result) => {
        if (err) console.log(err);
        const address = await Address.find({
          $and: [
            { $or: [{ customerId: result.customerId }] },
            { $or: [{ addressStatus: 1 }, { addressStatus: 0 }] },
          ],
        });
        if (result._id) {
          res
            .json({
              status: 201,
              message: "ลบข้อมูลที่อยู่เรียบร้อย",
              addresses: address,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              message: "ลบข้อมูลที่อยู่ล้มเหลว กรุณาลองใหม่อีกครั้ง",
              addresses: address,
            })
            .end();
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const deleteAddress = async (req, res) => {
  const { id } = req.body;
  await admin.findByIdAndDelete(id, async function (err, result) {
    if (err) console.log(err);
    const address = await admin.find({});
    if (result !== null) {
      console.log(address)
      res
        .json({
          status: 200,
          message: "ลบข้อมูลประเภทสินค้าเรียบร้อย",
          addresses: address,
        })
        .end();
    } else {
      console.log(address)
      res
        .json({
          status: 401,
          message: "ลบข้อมูลประเภทสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
          addresses: address,
        })
        .end();
    }
  });
};
module.exports = {
  getAddress,
  createAddress,
  updateAddress,
  deleteStatusAddress,
  deleteAddress,
};
