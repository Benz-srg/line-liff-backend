const shippingCost = require("../model/shippingcost");

const getCost = async (req, res) => {
  const { quantity } = req.params;
  try {
    const shipping = await shippingCost.findOne();

    if (shipping.status == 0) {
      res.json({
        status: 200,
        shippingcost: shipping,
        cost: shipping.fixedCost,
      });
    } else {
      if (quantity > 1) {
        let cost = shipping.firstCost + shipping.anyCost * (quantity - 1);
        res.json({ status: 200, shippingcost: shipping, cost: cost });
      } else {
        res.json({
          status: 200,
          shippingcost: shipping,
          cost: shipping.firstCost,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const getShipping = async (req, res) => {
  try {
    const shipping = await shippingCost.findOne();
    res.json({ status: 200, shippingcost: shipping, cost: 0 });
  } catch (error) {
    console.log(error);
  }
};
const settingShippingCost = async (req, res) => {
  let resultAfterInsert;
  const resultBeforeInsert = await shippingCost.findOne();
  if (resultBeforeInsert.length == 0) {
    try {
      console.log("insert");
      const createShipping = new shippingCost(req.body);
      await createShipping.save(async (err, resultInsert) => {
        if (err) console.log(err);
      });
    } catch (error) {
      console.log(error);
    } finally {
      resultAfterInsert = await shippingCost.findOne();
    }
  } else {
    try {
      await shippingCost.findByIdAndUpdate(
        resultBeforeInsert._id,
        { $set: req.body },
        async (err, result) => {
          if (err) console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      resultAfterInsert = await shippingCost.findOne();
    }
  }
  if (resultAfterInsert) {
    res.json({ status: 200, shippingcost: resultAfterInsert, cost: 0 }).end();
  } else {
    res
      .json({
        status: 401,
        message: "เพิ่มตั้งค่าส่งล้มเหลว กรุณาลองใหม่อีกครั้ง",
        result: resultAfterInsert,
      })
      .end();
  }
};
module.exports = {
  getCost,
  getShipping,
  settingShippingCost,
};
