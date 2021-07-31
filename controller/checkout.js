const basket = require("../model/basket");
const product = require("../model/product");

const getBaskets = async (req, res) => {
  try {
    const { ids } = req.body;
    await basket
      .find({ _id: { $in: ids } }, function (err, resultBasket) {
        if (err) console.log(err);
        if (resultBasket) {
          res.json({ status: 200, checkouts: resultBasket }).end();
        } else {
          res.json({ status: 200, checkouts: [] }).end();
        }
      })
      .populate("productId")
      .populate("customerId");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getBaskets,
};
