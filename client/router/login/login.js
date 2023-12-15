const { now } = require("moment/moment");
const { connectDatabase, getAllUsers } = require("../../data/UserDatabase");
const { ulid } = require("ulid");
const User = require("../../data/user");
const sequelize = require("../../data/database");
// const login = require("../../tools/data/models/login");
const { genrateToken } = require("../../utils/jwtCheck");
const { argon, verify } = require("../../utils/argon");

exports.login = async (req, res) => {
  let { userName, password } = req.body;
  let passwordF = await argon(password);
  // user.find({ userName, passWordM: passwordF, condition }).then((result) => {
  //     res.send({ status: "ok", token: token, result })
  // }).catch((err)=>{
  //     res.send({ status: "refuse" })
  // })
  let result = await User.findAll({
    where:{
      userName:userName,
      passwordF:passwordF
    }
  });
  console.log(result)
  if (!result) {
    res.send({
      status: "refuse",
    });
    return;
  }
  result = result.toJSON();
  res.setHeader("Content-Type", "application/json");
  let token = genrateToken(result.userId);
  res.setHeader("Authorization", `Bearer ${token}`);
  res.send({
    msg: null,
    data: null,
    status: "ok",
  });
};
exports.signup = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      res.send({
        err: "empty",
        data: null,
      });
      return;
    }
    let { userName, password } = req.body;
    console.log(req.body);
    // 对密码进行哈希
    let passwordF = await argon(password); // 请确保 argon 函数的正确实现
    // 生成 ULID
    let userId = ulid();
    console.log(passwordF);
    // 创建用户对象 // 保存用户到数据库
    const user = await User.create({
      userName,
      passwordF,
      userId,
      permissions: 0, // 默认权限值
      loginTime: now(), // 默认登录时间
    });

    // 设置响应头
    res.setHeader("Content-Type", "application/json");
    console.log(user);
    // 发送成功响应
    res.send({ status: "ok", msg: null, data: null });
  } catch (err) {
    console.error(err);

    // 发送错误响应
    res
      .status(500)
      .send({ status: "error", msg: "Internal Server Error", data: null });
  }
};
