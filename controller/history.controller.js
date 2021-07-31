const historyModel = require("../model/history");
const orderModel = require("../model/order");
const customerModel = require("../model/customer");
const dayjs = require("dayjs");
// const historyItem = require('../controller/historyitem.controller')
const createHistory = async (req, res) => {
  const { id } = req.params;
  const { statusPaid, trackingNumber, shippingName } = req.body;
  const resultOrder = await orderModel.findOne({ _id: id });
  if (resultOrder) {
    let confirmOrder = 1;
    if (statusPaid == 2) {
      confirmOrder = 4;
    }
    const {
      customerId,
      bankId,
      note,
      total,
      discount,
      totalprice,
      code,
      shippingAddress,
      products,
      orderStatus,
    } = resultOrder;
    const payload = {
      customerId,
      bankId,
      note,
      total,
      discount,
      totalprice,
      code,
      shippingAddress,
      products,
      orderStatus,
      paidStatus: statusPaid,
      confirmStatus: confirmOrder,
      tackingNo: trackingNumber,
      shippingName: shippingName,
    };
    const newCreated = new historyModel(payload);
    await newCreated.save(async (err, resultInsert) => {
      if (err) {
        res.json({
          status: 401,
          orders: [resultInsert],
          message: "แก้ไขสถานะการจัดส่งล้มเหลว",
        });
      }
      if (resultInsert) {
        await orderModel.findOneAndDelete({ _id: id });
        //insert Items
        res.json({
          status: 200,
          orders: [resultInsert],
          message:
            "แก้ไขสถานะการจัดส่งเรียบร้อย รายการนี้จะถูกย้ายไปประวัติการซื้อขาย",
        });
      } else {
        res.json({
          status: 401,
          orders: [resultInsert],
          message: "แก้ไขสถานะการจัดส่งล้มเหลว",
        });
      }
    });
  } else {
    const resultOrder = await orderModel.find({ _id: id });
    res.json({
      status: 401,
      orders: resultOrder,
      message: "แก้ไขสถานะการจัดส่งล้มเหลว",
    });
  }
};

//แก้ไขข้อมูลขนส่ง
const editTrackingNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { shippingName, tackingNo } = req.body;
    await historyModel.findByIdAndUpdate(
      id,
      {
        $set: { shippingName: shippingName, tackingNo: tackingNo },
      },
      async function (error, response) {
        if (error) {
          res.json({ status: 400, message: "แก้ไขข้อมูลล้มเหลว" });
        }
        if (response) {
          const result = await historyModel
            .find({ _id: id })
            .populate("bankId")
            .populate("customerId")
            .populate("shippingAddress");
          res.json({
            status: 200,
            message: "บันทึกข้อมูลสำเร็จ",
            history: result,
          });
        } else {
          res.json({
            status: 400,
            message: "บันทึกข้อมูลล้มเหลว กรุณาลองใหม่อีกครั้ง",
          });
        }
      }
    );
  } catch (error) {
    res.json({ status: 400, message: "แก้ไขข้อมูลล้มเหลว" });
  }
};

const getHistory = async (req, res) => {
  try {
    const { type } = req.params;
    historyModel
      .find({ confirmStatus: type }, function (err, result) {
        if (err) {
          res.json({ status: 401, message: err });
        }
        res.json({ status: 200, history: result });
      })
      .populate("bankId")
      .populate("customerId")
      .populate("shippingAddress");
  } catch (error) {
    res.json({ status: 401, message: error });
  }
};

const getHistoryTypeWithDate = async (req, res) => {
  try {
    const { type, dateStart, dateEnd } = req.params;
    historyModel
      .find(
        {
          confirmStatus: type,
          createdAt: {
            $gte: dateStart,
            $lte: dateEnd,
          },
        },
        function (err, result) {
          if (err) {
            res.json({ status: 401, message: err });
          }
          res.json({ status: 200, history: result });
        }
      )
      .populate("bankId")
      .populate("customerId")
      .populate("shippingAddress");
  } catch (error) {
    res.json({ status: 401, message: error });
  }
};

const getHistoryWithId = async (req, res) => {
  try {
    const { id } = req.params;
    await historyModel
      .find({ _id: id }, function (err, result) {
        if (err) {
          res.status(400);
        }
        res.json({ status: 200, history: result });
      })
      .populate("bankId")
      .populate("customerId")
      .populate("shippingAddress");
  } catch (error) {
    res.status(401);
  }
};

/* dashboard */
function getNumberOfWeek() {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

//แสดงกราฟรายวัน
const getHistoryofDay = async (req, res) => {
  try {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let datestart = `${year}-${month}-${day}`;
    let dateend = `${year}-${month}-${day + 1}`;
    await historyModel.aggregate(
      [
        { $addFields: { month: { $month: "$createdAt" } } },
        { $sort: { _id: -1 } },
        {
          $match: {
            month: month,
            createdAt: {
              $gte: new Date(datestart),
              $lt: new Date(dateend),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { date: "$createdAt" },
            },
            total: {
              $sum: "$totalprice",
            },
          },
        },
      ],
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          let items = [];
          for (const days of result) {
            let newTime = dayjs(days._id).format("HH:mm:ss");
            days._id = newTime;
            items.push(days);
          }

          res.json({ status: 200, charts: items });
        }
      }
    );
  } catch (error) {
    res.end(401);
  }
};
//แสดงกราฟรายสัปดาห์
const getHistoryofWeek = async (req, res) => {
  const date = new Date();
  let month = date.getMonth() + 1;
  let week = getNumberOfWeek();
  await historyModel.aggregate(
    [
      {
        $addFields: {
          month: { $month: "$createdAt" },
          week: { $week: "$createdAt" },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $match: {
          month: month,
          week: week - 1,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: {
            $sum: "$totalprice",
          },
        },
      },
    ],
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json({ status: 200, charts: result });
      }
    }
  );
};
//แสดงกราฟยอดชายทั้งเดือน
const getHistoryofMonth = async (req, res) => {
  const date = new Date();
  let month = date.getMonth() + 1;
  await historyModel.aggregate(
    [
      { $addFields: { month: { $month: "$createdAt" } } },
      { $sort: { _id: 1 } },
      {
        $match: {
          month: month,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: {
            $sum: "$totalprice",
          },
        },
      },
    ],
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json({ status: 200, charts: result });
      }
    }
  );
};
//แสดงกราฟรายปี
const getHistoryofYear = async (req, res) => {
  const date = new Date();
  let year = date.getFullYear();
  await historyModel.aggregate(
    [
      {
        $addFields: {
          year: { $year: "$createdAt" },
        },
      },
      {
        $match: {
          year: year,
        },
      },
      {
        $group: {
          _id: { $substr: ["$createdAt", 5, 2] },
          total: {
            $sum: "$totalprice",
          },
        },
      },
    ],
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json({ status: 200, charts: result });
      }
    }
  );
};
//ลูกค้าใหม่ในเดือนนี้
const getNewcustomerofMonth = async (req, res) => {
  const date = new Date();
  let month = date.getMonth() + 1;
  await customerModel.aggregate(
    [
      { $addFields: { month: { $month: "$createdAt" } } },
      {
        $match: {
          month: month,
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // group by the month *number*, mongodb doesn't have a way to format date as month names
          numberofdocuments: { $sum: 1 },
        },
      },
    ],
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        let total = result.length > 0 ? result[0].numberofdocuments : 0;
        res.json({ status: 200, totalCustomer: total });
      }
    }
  );
};

// ยอดขายประจำวัน และ ยอดสั่งซื้อ
const getSumCurrentDate = async (req, res) => {
  try {
    let currentDate = new Date();
    let date = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    const datestart = `${year}-${month}-${date}`;
    await historyModel.aggregate(
      [
        { $sort: { createdAt: 1 } },
        {
          $match: {
            createdAt: {
              $gt: new Date(datestart),
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: {
              $sum: "$totalprice",
            },
            count: { $sum: 1 },
          },
        },
      ],
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          let total = result.length > 0 ? result[0].total : 0;
          let count = result.length > 0 ? result[0].count : 0;
          res.json({ status: 200, sumbydate: total, count: count });
        }
      }
    );
  } catch (error) {
    res.send(401);
  }
};
//ยอดขาย 7 วัน
const getLastsale7day = async (req, res) => {
  try {
    var d = new Date();
    d.setDate(d.getDate() - 7);
    await historyModel.aggregate(
      [
        { $match: { createdAt: { $gt: d } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: {
              $sum: "$totalprice",
            },
          },
        },
      ],
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          let total = 0;
          if (result.length > 0) {
            for (const item of result) {
              total += item.total;
            }
          }
          res.json({ status: 200, lastsale7day: total });
        }
      }
    );
  } catch (error) {
    res.send(401);
  }
};

/* customer */
const getHistoryCustomer = async (req, res) => {
  try {
    const { id, type } = req.params;
    historyModel
      .find({ customerId: id, confirmStatus: type }, function (err, result) {
        if (err) {
          res.json({ status: 401, message: err });
        }
        res.json({ status: 200, history: result });
      })
      .populate("bankId")
      .populate("customerId")
      .populate("shippingAddress");
  } catch (error) {
    res.json({ status: 401, message: error });
  }
};

const getHistoryTypeWithDateCustomer = async (req, res) => {
  try {
    const { id, type, dateStart, dateEnd } = req.params;
    historyModel
      .find(
        {
          customerId: id,
          confirmStatus: type,
          createdAt: {
            $gte: dateStart,
            $lte: dateEnd,
          },
        },
        function (err, result) {
          if (err) {
            res.json({ status: 401, message: err });
          }
          res.json({ status: 200, history: result });
        }
      )
      .populate("bankId")
      .populate("customerId")
      .populate("shippingAddress");
  } catch (error) {
    res.json({ status: 401, message: error });
  }
};

module.exports = {
  getHistory,
  getHistoryTypeWithDate,
  createHistory,
  getHistoryCustomer,
  getHistoryTypeWithDateCustomer,
  getHistoryWithId,
  getHistoryofMonth,
  getSumCurrentDate,
  getLastsale7day,
  getNewcustomerofMonth,
  getHistoryofDay,
  getHistoryofWeek,
  getHistoryofYear,
  //edit tracking
  editTrackingNumber,
};
