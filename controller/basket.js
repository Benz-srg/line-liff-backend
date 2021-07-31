const basket = require("../model/basket");
const product = require("../model/product");

const getBasket = async (req, res) => {
  try {
    const { id } = req.params;
    await basket
      .find({ customerId: id }, function (err, resultBasket) {
        if (err) console.log(err);
        if (resultBasket) {
          res.json({ status: 200, baskets: resultBasket }).end();
        } else {
          res.json({ status: 200, baskets: [] }).end();
        }
      })
      .populate("productId")
      .populate("customerId");
  } catch (error) {
    console.log(error);
  }
};

const createBasket = async (req, res) => {
  try {
    const newBasket = req.body;
    const { customerId, productId, quantity, size } = req.body;
    const basketExsit = await basket.findOne({
      customerId: customerId,
      productId: productId,
      size: size,
    });

    if (basketExsit) {
      await basket.findOneAndUpdate(
        {
          customerId: customerId,
          productId: productId,
        },
        { $set: { quantity: basketExsit.quantity + quantity } },
        async (err, result) => {
          if (err) console.log(err);
          const baskets = await basket
            .find({ customerId: customerId })
            .populate("productId");
          if (result) {
            res
              .json({
                status: 201,
                message: "คุณได้ทำการเพิ่มสินค้าลงในรถเข็นแล้ว",
                baskets: baskets,
              })
              .end();
          } else {
            res
              .json({
                status: 401,
                message:
                  "คุณได้ทำการเพิ่มสินค้าลงในรถเข็นล้มเหลว ลองใหม่อีกครั้ง",
                baskets: baskets,
              })
              .end();
          }
        }
      );
    } else {
      const newPostBasket = new basket(newBasket);
      await newPostBasket.save(async (err, resultBasket) => {
        if (err) throw err;
        const baskets = await basket
          .find({ customerId: customerId })
          .populate("productId");
        if (resultBasket._id) {
          res
            .json({
              status: 201,
              message: "คุณได้ทำการเพิ่มสินค้าลงในรถเข็นแล้ว",
              baskets: baskets,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              message:
                "คุณได้ทำการเพิ่มสินค้าลงในรถเข็นล้มเหลว กรุณาลองใหม่อีกครั้ง",
              baskets: baskets,
            })
            .end();
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateIncrease = async (req, res) => {
  try {
    const { id } = req.params;
    let { customerId, quantity } = req.body;
    quantity++;
    await basket.findOneAndUpdate(
      { _id: id, customerId: customerId },
      { $set: { quantity: quantity } },
      async (err, resultIncrease) => {
        if (err) console.log(err);
        const baskets = await basket
          .find({
            customerId: resultIncrease.customerId,
          })
          .populate("productId");
        if (resultIncrease) {
          res
            .json({
              status: 200,
              message: "คุณได้ทำการเพิ่มสินค้าในรถเข็นแล้ว",
              baskets: baskets,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              message: "คุณได้ทำการเพิ่มสินค้าในรถเข็นล้มเหลว",
              baskets: baskets,
            })
            .end();
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const updateDecrease = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerId } = req.body;
    const basketExsit = await basket.findOne({
      _id: id,
      customerId: customerId,
    });
    if (basketExsit) {
      if (basketExsit.quantity > 1) {
        await basket.findOneAndUpdate(
          { _id: id, customerId: customerId },
          { $set: { quantity: basketExsit.quantity - 1 } },
          async (err, resultDecrease) => {
            if (err) console.log(err);
            const baskets = await basket
              .find({ customerId: customerId })
              .populate("productId");
            if (resultDecrease) {
              res
                .json({
                  status: 200,
                  message: "คุณได้ทำการเพิ่มสินค้าในรถเข็นแล้ว",
                  baskets: baskets,
                })
                .end();
            } else {
              res
                .json({
                  status: 401,
                  message: "คุณได้ทำการเพิ่มสินค้าในรถเข็นล้มเหลว",
                  baskets: baskets,
                })
                .end();
            }
          }
        );
      } else {
        await basket.deleteOne({ _id: id }, async (err, result) => {
          if (err) console.log(err);
          const baskets = await basket
            .find({ customerId: customerId })
            .populate("productId");
          if (result) {
            res
              .json({
                status: 200,
                message: "คุณได้ทำการลบสินค้าในรถเข็นแล้ว",
                baskets: baskets,
              })
              .end();
          } else {
            res
              .json({
                status: 401,
                message: "คุณได้ทำการลบสินค้าในรถเข็นล้มเหลว",
                baskets: baskets,
              })
              .end();
          }
        });
      }
    } else {
      const baskets = await basket.find({ customerId: customerId });
      res
        .json({
          status: 401,
          message: "คุณได้ทำการลบสินค้าในรถเข็นล้มเหลว",
          baskets: baskets,
        })
        .end();
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteBasket = async (req, res) => {
  const { id } = req.params;
  const { customerId } = req.body;
  try {
    await basket.deleteOne({ _id: id }, async (err, result) => {
      if (err) console.log(err);
      const baskets = await basket.find({ customerId: customerId });
      if (result) {
        res
          .json({
            status: 200,
            message: "คุณได้ทำการลบสินค้าในรถเข็นแล้ว",
            baskets: baskets,
          })
          .end();
      } else {
        res
          .json({
            status: 401,
            message: "คุณได้ทำการลบสินค้าในรถเข็นล้มเหลว",
            baskets: baskets,
          })
          .end();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteBasketMany = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getBasket,
  createBasket,
  deleteBasket,
  deleteBasketMany,
  updateIncrease,
  updateDecrease,
};
