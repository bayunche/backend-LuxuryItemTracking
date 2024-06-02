const { now } = require("moment/moment");
const { connectDatabase, getAllUsers } = require("../../data/UserDatabase");
const { ulid } = require("ulid");
const User = require("../../data/user");
const sequelize = require("../../data/database");
const { generateToken } = require("../../utils/jwtCheck");
const { argon, verifyArgon } = require("../../utils/argon");
const configList = require("../../data/configList");
const tradeList = require("../../data/tradeList");

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const hashedPassword = await argon(password);
    const user = await User.findOne({ where: { userName } });

    if (!user) {
      res.send({ status: "refuse", msg: "用户名或密码错误" });
      return;
    }
    const isPasswordValid = await verifyArgon(user.passwordF, password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      res.send({ status: "refuse", msg: "用户名或密码错误" });
      return;
    }
    const token = generateToken(user.userId);
    User.update({ loginTime: now() }, { where: { userId: user.userId } });
    res.setHeader("Authorization", `Bearer ${token}`);
    res.send({ status: "ok", msg: null, data: null });
  } catch (error) {
    console.error("Error in login:", error);
    res
      .status(500)
      .send({ status: "error", msg: "Internal Server Error", data: null });
  }
};

exports.signup = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.send({ status: "refuse", msg: "参数错误", data: null });
    }
    const { userName, password } = req.body;
    const hashedPassword = await argon(password);
    const userId = ulid();
    console.log(hashedPassword);
    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { userName } });
    if (existingUser) {
      return res.send({ status: "refuse", msg: "用户名已存在", data: null });
    }
    const user = await User.create({
      userName,
      passwordF: hashedPassword,
      userId,
      permissions: 0,
      balace: "0.00",
      name: userName,
      loginTime: now(),
    });
    res.setHeader("Content-Type", "application/json");
    res.send({ status: "ok", msg: null, data: null });
  } catch (error) {
    console.error("Error in signup:", error);
    res
      .status(500)
      .send({ status: "error", msg: "Internal Server Error", data: null });
  }
};

exports.getTopUp = async (req, res) => {
  try {
    let result = await configList.findOne({ where: { id: 1 } });
    return res.send({
      status: "ok",
      msg: "获取充值比例成功",
      data: result.TopUp,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: "refuse",
      msg: "获取充值比例失败",
      data: null,
    });
  }
};

