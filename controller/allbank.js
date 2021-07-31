const allbank = require("../model/allbank");

const getAllBanks = async (req, res) => {
  try {
    const allbanks = await allbank.find({});
    res
    .json({
      status: 201,
      message: "บันทึกข้อมูลผู้ดูแลระบบเรียบร้อย",
      allbanks: allbanks,
    })
    .end();
  } catch (error) {
    console.log(error);
  }
};

const createAllBank = async (req, res) => {
  const allbankExsit = await allbank.findOne({
    account: req.body.account,
  });
  if (allbankExsit) {
    res
      .json({
        status: 401,
        message: "บันทึกข้อมูลผู้ดูแลระบบล้มเหลว เนื่องจากชื่อผู้ใช้ซ้ำ",
      })
      .end();
  } else {
    const newAllbank = new allbank(req.body);
    await newAllbank.save(async (err, resultInsert) => {
      if (err) throw err;
      const allbanks = await allbank.find({});
      if (resultInsert._id) {
        res
          .json({
            status: 201,
            message: "บันทึกข้อมูลผู้ดูแลระบบเรียบร้อย",
            allbanks: allbanks,
          })
          .end();
      } else {
        res
          .json({
            status: 401,
            message: "บันทึกข้อมูลผู้ดูแลระบบล้มเหลว กรุณาลองใหม่อีกครั้ง",
            allbanks: allbanks,
          })
          .end();
      }
    });
  }
};

const deleteAllBank = async (req, res) => {
  const { id } = req.body;
  await admin.findByIdAndDelete(id, async function (err, result) {
    if (err) console.log(err);
    const updateresult = await admin.find({});
    if (result !== null) {
      res
        .json({
          status: 200,
          message: "ลบข้อมูลประเภทสินค้าเรียบร้อย",
          admins: updateresult,
        })
        .end();
    } else {
      res
        .json({
          status: 401,
          message: "ลบข้อมูลประเภทสินค้าล้มเหลว กรุณาลองใหม่อีกครั้ง",
          admins: updateresult,
        })
        .end();
    }
  });
};

module.exports = {
  getAllBanks,
  createAllBank,
  deleteAllBank,
};
