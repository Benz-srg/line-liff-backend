const config = require("../configs/auth.config");
const adminModel = require("../model/admin");

var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 8;

const signUpAdmin = async (req, res) => {
  try {
    const adminExsit = await adminModel.findOne({
      userName: req.body.userName,
    });
    if (adminExsit) {
      res
        .json({
          status: 401,
          message: "บันทึกข้อมูลผู้ดูแลระบบล้มเหลว เนื่องจากชื่อผู้ใช้ซ้ำ",
        })
        .end();
    } else {
      const newAdmin = new adminModel({
        fullName: req.body.fullName,
        userName: req.body.userName,
        passWord: bcrypt.hashSync(req.body.passWord, saltRounds),
        email: req.body.email,
        role: req.body.role,
        tel: req.body.tel,
      });
      await newAdmin.save(async (err, resultInsert) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        const admins = await adminModel.find({});
        if (resultInsert._id) {
          res
            .json({
              status: 201,
              message: "บันทึกข้อมูลผู้ดูแลระบบเรียบร้อย",
              admins: admins,
            })
            .end();
        } else {
          res
            .json({
              status: 401,
              message: "บันทึกข้อมูลผู้ดูแลระบบล้มเหลว กรุณาลองใหม่อีกครั้ง",
              admins: admins,
            })
            .end();
        }
      });
    }
  } catch (error) {
    res.status(500).send({ status: 500, message: error });
  }
};

const signInAdmin = async (req, res) => {
  const { username, password } = req.body;
  await adminModel.findOne({ userName: username }).exec(async (err, admin) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!admin) {
      return res.status(200).send({ message: "User Not found." });
    }
    var isPasswordIsValid = bcrypt.compareSync(password, admin.passWord);
    //console.log(admin.passWord)
    if (!isPasswordIsValid) {
      return res
        .status(200)
        .send({ accessToken: null, message: "Invalid Password" });
    }

    var token = jwt.sign({ id: admin._id }, config.secret, {
      expiresIn: 86400, //24 hours
    });
    console.log(admin.role);
    await res.status(200).send({
      id: admin._id,
      username: admin.userName,
      role: admin.role,
      fullName: admin.fullName,
      accessToken: token,
      expiresIn: 86400,
    });
  });
};

module.exports = { signInAdmin, signUpAdmin };
