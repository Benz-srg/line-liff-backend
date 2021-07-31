const coupon = require("../model/coupon");
const basketsModel = require("../model/basket");

const getCoupons = async (req, res) => {
  try {
    const coupons = await coupon.find({}).populate("productAvaliable");
    res.json({ status: 200, coupons: coupons });
  } catch (error) {
    console.log(error);
  }
};

const createCoupon = async (req, res) => {
  const couponCodeExsit = await coupon.findOne({
    code: req.body.code,
  });
  if (couponCodeExsit) {
    res
      .json({
        status: 401,
        message: "บันทึกข้อมูลคูปองล้มเหลว เนื่องจากรหัสคูปองซ้ำ",
      })
      .end();
  } else {
    const newCoupon = new coupon(req.body);
    await newCoupon.save(async (err, resultInsert) => {
      if (err) throw err;
      const coupons = await coupon.find({});
      if (resultInsert._id) {
        res
          .json({
            status: 201,
            message: "บันทึกข้อมูลคูปองเรียบร้อย",
            coupons: coupons,
          })
          .end();
      } else {
        res
          .json({
            status: 401,
            message: "บันทึกข้อมูลคูปองล้มเหลว กรุณาลองใหม่อีกครั้ง",
            coupons: coupons,
          })
          .end();
      }
    });
  }
};

const queryCouponWithId = async (req, res) => {
  try {
    const { id } = req.params;
    await coupon.findById(id, (err, result) => {
      if (err) throw err;
      if (result) {
        res.json({ status: 200, coupons: result }).end();
      } else {
        res.json({ status: 400, message: "ไม่พบข้อมูลคูปอง" }).end();
      }
    });
  } catch (error) {
    console.log(error);
  }
};
const updateCoupon = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  try {
    await coupon.findByIdAndUpdate(
      id,
      { $set: req.body },
      async (err, result) => {
        if (err) console.log(err);
        const updateresult = await coupon.find({});
        if (result._id) {
          res
            .json({
              status: 201,
              message: "แก้ไขข้อมูลประเภทสินค้าเรียบร้อย",
              coupons: updateresult,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              message: "แก้ไขข้อมูลประเภทสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
              coupons: updateresult,
            })
            .end();
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const deleteCoupon = async (req, res) => {
  const { id } = req.body;
  await coupon.findByIdAndDelete(id, async function (err, result) {
    if (err) console.log(err);
    const updateresult = await coupon.find({});
    console.log(result);
    if (result !== null) {
      res
        .json({
          status: 200,
          message: "ลบข้อมูลประเภทสินค้าเรียบร้อย",
          coupons: updateresult,
        })
        .end();
    } else {
      res
        .json({
          status: 401,
          message: "ลบข้อมูลประเภทสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
          coupons: updateresult,
        })
        .end();
    }
  });
};

/* coupon customer */
const queryCouponWithProductId = async (req, res) => {
  const { id } = req.body;
  try {
    let productId = [];
    await basketsModel.find({ _id: { $in: id } }, (err, resultBasket) => {
      if (err) {
        console.log(err);
      }
      if (resultBasket.length > 0) {
        resultBasket.map((row) => productId.push(row.productId));
      }
    });
    await coupon
      .find({ productAvaliable: { $in: productId } }, (err, result) => {
        if (err) {
          res.json({ status: 401, message: [] });
        }
        res.json({ status: 200, result: result });
      })
      .populate("productAvaliable");
  } catch (error) {}
};

const queryCouponWithInputCode = async (req, res) => {
  const { id } = req.params;
  try {
    await coupon.find(
      {
        code: id,
        action: 1,
      },
      (error, result) => {
        if (error) {
          console.log(error);
        }
        if (result) {
          if (result.length > 0 && result[0].couponLimit > 0) {
            res.json({ status: 200, result: result });
          } else {
            res.json({ status: 200, result: [] });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  queryCouponWithId,
  queryCouponWithProductId,
  queryCouponWithInputCode,
};
