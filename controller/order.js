const orderModel = require("../model/order");
const productModel = require("../model/product");
const basketModel = require("../model/basket");
const couponModel = require("../model/coupon");
const addressModel = require("../model/address");
const { createHistory } = require("./history.controller");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../uploads/slip"));
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

const uploadSlip = async (req, res) => {
  const photo = req.file;
  const { id } = req.params;
  console.log(!!photo);
  if (photo) {
    const { filename } = photo;
    try {
      const { slip } = await orderModel.findById(id);
      if (slip) {
        fs.access(`uploads/slip/${slip}`, fs.F_OK, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          fs.unlink(`uploads/slip/${slip}`, (errImage) => {
            if (errImage) console.log(errImage);
          });
        });
      }
      await orderModel.findByIdAndUpdate(
        id,
        { slip: filename },
        async (error, result) => {
          if (error) {
            res.status(400).json({ message: error });
          }
          const newPhotos = await orderModel.find({});
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
        }
      );
    } catch (error) {
      res.json({ message: error.message });
    }
  }
};

/* start admin */

const getOrderCmsAdmin = async (req, res) => {
  try {
    await orderModel
      .find((err, result) => {
        if (err) throw err;
        res.json({ status: 200, orders: result });
      })
      .sort([["updatedAt", -1]])
      .populate("customerId")
      .populate("bankId");
  } catch (error) {
    console.log(error);
  }
};

const getOrderCmsAdminwithId = async (req, res) => {
  try {
    const { id } = req.params;
    await orderModel
      .find({ _id: id }, (err, result) => {
        if (err) throw err;
        res.json({ status: 200, orders: result });
      })
      .sort([["updatedAt", -1]])
      .populate("customerId")
      .populate("bankId")
      .populate("shippingAddress");
  } catch (error) {
    console.log(error);
  }
};

const updatedPendingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusPaid, trackingNumber } = req.body;
    await createHistory(req, res);
  } catch (error) {
    console.log(error);
  }
};
/* end admin */

/* customer */
const createOrder = async (req, res) => {
  const newOrder = new orderModel(req.body);
  await newOrder.save(async (err, resultInsert) => {
    if (err) console.log(err);
    const selectOrders = await orderModel.find({});
    let isDeleteStock = false;
    if (resultInsert) {
      /*  */
      newOrder.products.forEach(async (basket) => {
        const disStock = await productModel.findByIdAndUpdate(
          basket.productId._id,
          {
            $inc: { quantity: -basket.quantity },
          }
        );
        if (disStock) {
          await basketModel.findByIdAndDelete(
            basket._id,
            function (err, deleteBasket) {
              if (err) console.log(err);
              if (deleteBasket) {
                isDeleteStock = true;
              }
            }
          );
          await couponModel.findOneAndUpdate(
            { code: req.body.code },
            {
              $inc: { couponLimit: -1 },
            }
          );
        }
      });
      /*  */
      res
        .json({
          status: 201,
          message: "บันทึกข้อมูลสั่งซื้อสินค้าเรียบร้อย",
          orders: selectOrders,
        })
        .end();
    } else {
      res
        .json({
          status: 401,
          message: "บันทึกข้อมูลสั่งซื้อสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
          orders: selectOrders,
        })
        .end();
    }
  });
};

const updateCancelOrder = async (req, res) => {
  const { id } = req.params;
  try {
    await orderModel.findByIdAndUpdate(
      id,
      { orderStatus: 3 },
      async (err, result) => {
        if (err) console.log(err);
        const updateresult = await orderModel.find({});
        if (result._id) {
          req.body.statusPaid = 1;
          await createHistory(req, res);
        } else {
          res
            .json({
              status: 401,
              message: "ยกเลิกออเดอรล้มเหลว กรุณาลองใหม่อีกครั้ง",
              orders: updateresult,
            })
            .end();
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const getOrder = async (req, res) => {
  let customerId = req.params.customerId;
  console.log(customerId, "customerIds");
  try {
    const orders = await orderModel.find(
      { customerId: customerId },
      async function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Result : ", "very good");
        }
      }
    );
    console.log(orders);
    await res.json({
      status: 200,
      message: "มีข้อมูลออร์เดอร์",
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
};

// ดึงที่อยู่ทั้งหมดของuserไปแสดงเพื่อใช้สำหรับการเปลี่ยนแปลงที่อยู่จัดส่งภายใน order
const getOrderAddress = async (req, res) => {
  const customerId = req.params.id; //req.params.id;
  try {
    await addressModel.find({ customerId: customerId }, async (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.length != 0) {
        await res.json({
          status: 200,
          message: "มีข้อมูลที่อยู่",
          data: result,
        });
      } else {
        await res.json({
          status: 401,
          message: "เกิดข้อผิดพลาด ไม่พบข้อมูล",
          data: result,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

//เปลี่ยนที่อยู่ใน order
const updateAddressOrder = async (req, res) => {
  const { id, shippingId } = req.params;
  try {
    await orderModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          shippingAddress: shippingId,
        },
      },
      async (err, result) => {
        if (err) {
          console.log(err);
          return res.json({ status: 403, message: err.message });
        }
        console.log(result);
        if (result._id) {
          return res.json({
            status: 200,
            message: "เปลี่ยนที่อยู่สำเรี็จ!!",
            data: result,
          });
        } else {
          return res.json({
            status: 401,
            message: "เปลี่ยนที่อยู่ไม่สำเร็จ",
            data: result,
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const getSlip = async (req, res) => {
  const { id } = req.params;
  try {
    await orderModel.findById(id, (res, error) => {
      if (error) {
        res.json({ status: 400, message: "ไม่พบข้อมูล" });
      }
      res.json({ status: 200, photos: res });
    });
  } catch (err) {
    res.status(400).json({ message: "not found data.." });
  }
};

module.exports = {
  createOrder,
  /* admin... */
  getOrderCmsAdmin,
  getOrderCmsAdminwithId,
  updatedPendingStatus,
  getOrder,
  updateCancelOrder,
  getOrderAddress,
  updateAddressOrder,
  uploadSlip,
  upload,
  getSlip,
};
