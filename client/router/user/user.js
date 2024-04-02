const {
  mintNFTs,
  isLuxuryItemExists,
  getLuxuryItemDetails,
  certifyUser,
  updateSalesRecord,
  updateLogisticsInfo,
  createAccount,
} = require("../../utils/interactWithContract");
const User = require("../../data/user");
const sequelize = require("../../data/database");
const { updateUser, getUserById } = require("../../data/UserDatabase");
const generateSecureRandomNumber = require("../../utils/randomInt");
const ItemList = require("../../data/itemList");
const { ulid } = require("ulid");
const { now } = require("moment");
const moment = require("moment");
const logisticsInfoData = require("../../data/logisticsInfo");
const router = require("./router");
const qrcode = require("qrcode");
const salesInfo = require("../../data/salesInfo");

exports.createUserPrivateKey = async (req, res) => {
  try {
    // Extracting userId from the request object
    const { userId } = req;
    console.log(userId);

    // Retrieve the user from the database
    let user = await User.findOne({ where: { userId } });
    console.log(user);

    // Check if the user already has an address
    if (!user || !user.address) {
      // Also, ensure user exists before checking its properties
      // Create a new blockchain account for the user
      const address = await createAccount(userId);
      console.log(address);

      // Update the user's address and balance in the database
      const [updateCount] = await User.update(
        { address, balance: "2" }, // Directly use shorthand property names
        { where: { userId } } // Use the same shorthand notation here
      );
      console.log(updateCount);

      // Check if the update was successful
      if (updateCount > 0) {
        return res.send({
          status: "success",
          msg: "创建用户权限成功",
          data: null,
        });
      } else {
        return res.send({ status: "refuse", msg: "创建用户失败", data: null });
      }
    } else {
      // User already has a registered blockchain account
      return res.send({
        status: "refuse",
        msg: "已注册区块链账户",
        data: null,
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return res
      .status(500)
      .send({ status: "error", msg: "服务器内部错误", data: error.toString() });
  }
};

exports.certifiedUser = async (req, res) => {
  const userId = req.userId;
  let user = await User.findOne({ where: { userId: userId } });
  // user = user.toJSON();
  console.log(user);
  if (user.address && user.balance) {
    res.send({
      status: "success",
      msg: "用户已注册区块链账户",
      data: user.address,
    });
  } else {
    res.send({ status: "refuse", msg: "用户未注册区块链账户", data: null });
  }
};

exports.getUserInfo = async (req, res) => {
  const userId = req.userId;
  let userDetail = await User.findOne({ where: { userId: userId } });
  // userDetail = userDetail.toJSON();
  res.send({
    msg: "获取用户信息成功",
    data: userDetail,
  });
};

exports.editUserInfo = async (req, res) => {
  const userId = req.userId;
  const { userName, permissions, phone, email, avatar } = req.body;
  //请求参数都不能为空
  if (!userName || !permissions || !phone || !email || !avatar) {
    return res.send({ status: "refuse", msg: "请求参数不能为空", data: null });
  }
  const userDetail = await User.findOne({ where: { userId: userId } });
  if (userDetail) {
    const [updateCount] = await User.update(
      {
        userName,
        permissions,
        phone,
        email,
        avatar,
      },
      {
        where: { userId: userId },
      }
    );
    if (updateCount > 0) {
      return res.send({
        status: "success",
        msg: "修改用户信息成功",
        data: null,
      });
    } else {
      return res.send({
        status: "refuse",
        msg: "修改用户信息失败",
        data: null,
      });
    }
  } else {
    return res.send({ status: "refuse", msg: "未找到该用户", data: null });
  }
};
exports.editUserPassword = async (req, res) => {
  const userId = req.userId;
  const { oldPassword, newPassword } = req.body;
  //请求参数都不能为空
  if (!oldPassword || !newPassword) {
    return res.send({ status: "refuse", msg: "请求参数不能为空", data: null });
  }

  const userDetail = await User.findOne({ where: { userId: userId } });
  const isPasswordValid = await verifyArgon(userDetail.passwordF, oldPassword);

  if (isPasswordValid) {
    const hashedPassword = await argon(newPassword);
    console.log(hashedPassword);
    const [updateCount] = await User.update(
      {
        passwordF: hashedPassword,
      },
      {
        where: { userId: userId },
      }
    );
    if (updateCount > 0) {
      return res.send({
        status: "success",
        msg: "修改用户密码成功",
        data: null,
      });
    } else {
      return res.send({
        status: "refuse",
        msg: "修改用户密码失败",
        data: null,
      });
    }
  } else {
    return res.send({ status: "refuse", msg: "原密码错误", data: null });
  }
};
