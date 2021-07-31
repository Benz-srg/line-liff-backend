const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://rabbit:rDmkHram34C6diGU@cluster0.sfxau.mongodb.net/shopliff?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log(`shop db connected:`);
});

const app = express();

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.static(__dirname + "/assets"));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
/*  */

const productRoute = require("./route/productRoute");
const categoriesRoute = require("./route/categoriesRoute");
const couponRoute = require("./route/couponRoute");
const customerRoute = require("./route/customerRoute.js");
const adminRoute = require("./route/adminRoute");
const basketRoute = require("./route/basketRoute.js");
const checkoutRoute = require("./route/checkout");
const customerproductRoute = require("./route/cproductRoute");
const bankRoute = require("./route/bank");
const orderRoute = require("./route/orderRoute.js");
const paymentUserRoute = require("./route/paymentUserRoute.js");
const AddressRoute = require("./route/addressRoute.js");
const allbankRoute = require("./route/allbankRoute.js");
const roleRoute = require("./route/roleRoute");
const historyRoute = require("./route/historyRoute");
const aboutRoute = require("./route/aboutRoute");
const promotionRoute = require("./route/promotionRoute");
const bannerRoute = require("./route/bannerRoute");
const shippingcostRoute = require("./route/shippingcostRoute");
app.use(aboutRoute);
app.use(productRoute);
app.use(categoriesRoute);
app.use(couponRoute);
app.use(customerRoute);
app.use(adminRoute);
app.use(basketRoute);
app.use(checkoutRoute);
app.use(customerproductRoute);
app.use(bankRoute);
app.use(orderRoute);
app.use(paymentUserRoute);
app.use(AddressRoute);
app.use(allbankRoute);
app.use(roleRoute);
app.use(bannerRoute);
app.use(shippingcostRoute);
app.use(roleRoute);
app.use(historyRoute);
app.use(promotionRoute);
app.listen(process.env.PORT || 9000, () => {
  console.log(`Shop is runing port ${9000}`);
});
