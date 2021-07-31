const roleModel = require("../model/role");
const permissionModel = require("../model/rolePermission");
const adminModel = require("../model/admin");
const permission = require("../utils/constant");

//Create Role in CMS
const createRole = async (req, res) => {
  console.log(req.body, " - > log role");
  try {
    const role = new roleModel(req.body);
    await role.save(async (err, resultInsert) => {
      if (err) {
        if (err.name === "MongoError" && err.code === 11000) {
          // Duplicate username
          return res.json({
            status: 422,
            success: false,
            message: "มีระดับผู้ดูแลนี้บนระบบแล้ว",
          });
        }
      }
      const roles = await roleModel.find({});
      if (resultInsert._id) {
        let data = {
          roleId: role._id,
          permission: permission,
        };
        const rolePermission = new permissionModel(data);
        rolePermission.save(async (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result._id) {
            res
              .json({
                status: 201,
                message: "บันทึกข้อมูลระดับผู้ดูแลเรียบร้อย",
                roles: roles,
              })
              .end();
          } else {
            res
              .json({
                status: 401,
                message: "บันทึกข้อมูลระดับผู้ดูแลล้มเหลว กรุณาลองใหม่อีกครั้ง",
                roles: roles,
              })
              .end();
          }
        });
      } else {
        res
          .json({
            status: 401,
            message: "บันทึกข้อมูลระดับผู้ดูแลล้มเหลว กรุณาลองใหม่อีกครั้ง",
            roles: role,
          })
          .end();
      }
    });
  } catch (error) {
    res.json({ status: 401, message: "error" });
  }
};

//get all roles in DB
const getAllRoles = async (req, res) => {
  try {
    const allRoles = await roleModel.find({});
    return res.json({ status: 200, roles: allRoles });
  } catch (err) {
    console.log(err);
  }
};

//delete role
const deleteRole = async (req, res) => {
  const { id } = req.body;
  await permissionModel.deleteMany({ roleId: { $in: id } });
  await roleModel.findByIdAndDelete(id, async function (err, result) {
    if (err) console.log(err);
    const updateresult = await roleModel.find({});
    if (err) {
      res
        .json({
          status: 401,
          message: "ลบข้อมูลตำแหน่งผู้ดูแลล้มเหลว กรุณาลองใหม่อีกครั้ง",
          roles: updateresult,
        })
        .end();
    } else {
      res
        .json({
          status: 200,
          message: "ลบข้อมูลตำแหน่งผู้ดูแลเรียบร้อย",
          roles: updateresult,
        })
        .end();
    }
  });
};

const getQueryRolePermission = async (req, res) => {
  console.log(req.params.roleId);
  try {
    const permission = await permissionModel.findOne({
      roleId: req.params.roleId,
    });
    return res.json({
      status: 200,
      message: "รับข้อมูลสำเร็จ",
      permissions: permission,
    });
  } catch (err) {
    console.log(err);
  }
};
//แก้ไขสิทธิ์การเข้าใช้งานของตำแหน่งต่างๆ
const updateRolePermission = async (req, res) => {
  console.log(req.params, req.body);
  const { permissionId } = req.params;
  try {
    await permissionModel.findByIdAndUpdate(
      permissionId,
      { permission: [req.body] },
      async (err, result) => {
        if (err) {
          console.log(err);
        }
        const updateresult = await permissionModel.findOne({
          _id: permissionId,
        });
        if (result._id) {
          return res
            .json({
              status: 200,
              message: "แก้ไขข้อมูลตำแหน่งเรียบร้อย",
              permissions: updateresult,
            })
            .end();
        } else {
          return res
            .json({
              status: 401,
              message: "แก้ไขข้อมูลตำแหน่งล้มเหลว กรุณาลองใหม่อีกครั้ง",
              permissions: updateresult,
            })
            .end();
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const getRolePermissionByName = async (req, res) => {
  try {
    const role = await roleModel.findOne({ roleName: req.params.roleName });
    const { _id } = await role;
    const rolePermission = await permissionModel.findOne(
      { roleId: _id },
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result._id) {
          return res.json({
            status: 200,
            message: "รับข้อมูลสิทธิ์ของตำแหน่งนี้เรียบร้อย",
            data: result,
          });
        } else {
          return res.json({
            status: 401,
            message: "เกิดข้อผิดพลาด ไม่สามารถรับข้อมูลได้",
            data: result,
          });
        }
      }
    );
    // return res.json({ status: 200, data: rolePermission });
  } catch (err) {
    console.log(err);
  }
};

const getRolePermissionByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const roleName = await adminModel.findOne({ _id: id });
    const { role } = await roleName;
    //function from upper
    const roles = await roleModel.findOne({ roleName: role });
    const { _id } = await roles;
    const rolePermission = await permissionModel.findOne(
      { roleId: _id },
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result._id) {
          return res.json({
            status: 200,
            message: "รับข้อมูลสิทธิ์ของตำแหน่งนี้เรียบร้อย",
            data: result,
          });
        } else {
          return res.json({
            status: 401,
            message: "เกิดข้อผิดพลาด ไม่สามารถรับข้อมูลได้",
            data: result,
          });
        }
      }
    );
    //end finded
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createRole,
  getAllRoles,
  deleteRole,
  getQueryRolePermission,
  updateRolePermission,
  getRolePermissionByName,
  getRolePermissionByUserId,
};
