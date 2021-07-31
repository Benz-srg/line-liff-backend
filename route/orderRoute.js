const express = require("express");
const route = express.Router();
const { verifyToken } = require("../middlewares/authJwtAdmin");

const {
  getOrderCmsAdmin,
  getOrderCmsAdminwithId,
  updatedPendingStatus,
  getOrder,
  updateCancelOrder,
  createOrder,
  getOrderAddress,
  updateAddressOrder,
  uploadSlip,
  upload,
} = require("../controller/order");

route.post("/order", createOrder);
route.put("/order/cancel/:id", updateCancelOrder);
route.get("/order/:customerId", getOrder);
route.get("/order/getAddress/:id", getOrderAddress);
route.put("/order/changeAddress/:id/:shippingId", updateAddressOrder);
route.post("/order/uploadSlip/:id", upload.single("photo"), uploadSlip);

/* route admin [verifyToken] */
route.get("/cms/order", getOrderCmsAdmin);
route.get("/cms/order/:id", getOrderCmsAdminwithId);
route.put("/cms/order/paid/:id", updatedPendingStatus);

module.exports = route;
