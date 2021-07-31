const express = require("express");
const route = express.Router();
const {
  getHistory,
  getHistoryTypeWithDate,
  getHistoryCustomer,
  getHistoryTypeWithDateCustomer,
  getHistoryWithId,
  /* dashboard */
  getHistoryofMonth,
  getSumCurrentDate,
  getLastsale7day,
  getNewcustomerofMonth,
  getHistoryofWeek, //week
  getHistoryofDay, //day
  getHistoryofYear, //year
  editTrackingNumber,
} = require("../controller/history.controller");

route.get("/history/type/:type", getHistory);
route.get("/history/:id", getHistoryWithId);
route.get("/history/search/:type/:dateStart/:dateEnd", getHistoryTypeWithDate);
/* customer */
route.get("/history/customer/:id/:type", getHistoryCustomer);
route.get(
  "/history/customer/search/:id/:type/:dateStart/:dateEnd",
  getHistoryTypeWithDateCustomer
);
route.put("/history/shipping/:id", editTrackingNumber);

route.get("/dashboard/sumisdate", getSumCurrentDate);
route.get("/dashboard/7day", getLastsale7day);
route.get("/dashboard/customermonth", getNewcustomerofMonth);

//dashboard chart
route.get("/dashboard/Day", getHistoryofDay);
route.get("/dashboard/Week", getHistoryofWeek);
route.get("/dashboard/Month", getHistoryofMonth);
route.get("/dashboard/Year", getHistoryofYear);

module.exports = route;
