const admin = require("../model/admin");

const getAdmins = async (req, res) => {
  try {
    const admins = await admin.find({}).populate("productAvaliable");
    res.json({ status: 200, admins: admins });
  } catch (error) {
    console.log(error);
  }
};


const queryAdminWithId = async (req, res) => {
  try {
    const { id } = req.params;
    await admin.findById(id, (err, result) => {
      if (err) throw err;
      if (result) {
        res.json({ status: 200, admins: result }).end();
      } else {
        res.json({ status: 400, admins: [] }).end();
      }
    });
  } catch (error) {
    console.log(error);
  }
};
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    await admin.findByIdAndUpdate(
      id,
      { $set: req.body },
      async (err, result) => {
        if (err) console.log(err);
        const updateresult = await admin.find({});
        if (result._id) {
          res
            .json({
              status: 201,
              message: "แก้ไขข้อมูลผู้ดูแลระบบเรียบร้อย",
              admins: updateresult,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              message: "แก้ไขข้อมูลผู้ดูแลระบบล้มเหลว กรุณาลองใหม่อีกครั้ง",
              admins: updateresult,
            })
            .end();
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const deleteAdmin = async (req, res) => {
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
  getAdmins,
  updateAdmin,
  deleteAdmin,
  queryAdminWithId,
};
