const express = require("express");
const route = express.Router();
const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  queryCouponWithId,
  queryCouponWithProductId,
  queryCouponWithInputCode,
} = require("../controller/coupon");

route.get("/coupon", getCoupons);
route.get("/coupon/:id", queryCouponWithId);
route.post("/coupon", createCoupon);
route.put("/coupon/:id", updateCoupon);
route.delete("/coupon", deleteCoupon);

/* customer */
route.post("/coupon/check", queryCouponWithProductId);
route.get("/coupon/check/:id", queryCouponWithInputCode);

module.exports = route;
