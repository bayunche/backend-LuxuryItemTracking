const {
  mintNFTs,
  isLuxuryItemExists,
  getLuxuryItemDetails,
  certifyUser,
  updateSalesRecord,
  updateLogisticsInfo,
  createAccount,
  createAccountEthers,
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
const { verifyArgon, argon } = require("../../utils/argon");
const {
  getOrderStr,
  getScheme,
  getAliOrderResult,
} = require("../../utils/aliSdk");
const Pingpp = require("pingpp");

exports.createUserPrivateKey = async (req, res) => {
  try {
    // Extracting userId from the request object
    const { userId } = req;
    const { value, trueValue } = req.body;

    let { orderStr, out_trade_no } = await getOrderStr(value, userId);
    res.send({
      status: "success",
      msg: "获取订单信息成功",
      data: orderStr,
    });
    await getAliOrderResult(out_trade_no, userId, trueValue)
    // Retrieve the user from the database
    let user = await User.findOne({ where: { userId } });
    // Check if the user already has an address
    if (!user || !user.address) {
      // Also, ensure user exists before checking its properties
      // Create a new blockchain account for the user

      // const address = await createAccount(userId);

      const { address, privateKey } = await createAccountEthers(userId);
      console.log(address);

      // Update the user's address and balance in the database
      const [updateCount] = await User.update(
        { address, balance: "2", privateKey }, // Directly use shorthand property names
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
  const { userName, permissions, phone, email, avatar, name } = req.body;
  //如果没找到该用户
  try {
    let user = await User.findOne({ where: { userId: userId } });
    if (!user) {
      return res.send({ status: "refuse", msg: "未找到该用户", data: null });
    }
  } catch (error) {
    console.log(error);
    return res.send({
      status: "refuse",
      msg: "服务器内部错误",
      data: null,
    });
  }

  //只修改不为空的请求参数
  try {
    if (userName) {
      await User.update({ userName }, { where: { userId: userId } });
    }
    if (permissions) {
      await User.update({ permissions }, { where: { userId: userId } });
    }
    if (phone) {
      await User.update({ phone }, { where: { userId: userId } });
    }
    if (email) {
      await User.update({ email }, { where: { userId: userId } });
    }
    if (avatar) {
      await User.update({ avatar }, { where: { userId: userId } });
    }
    if (name) {
      await User.update({ name }, { where: { userId: userId } });
    }

    res.send({
      status: "success",
      msg: "修改用户信息成功",
      data: null,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: "refuse",
      msg: "修改用户信息失败",
      data: null,
    });
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

exports.getAliOrderInfo = async (req, res) => {
  const { userId } = req;
  const { value, trueValue } = req.body;
  //沙箱环境
  try {
    let { orderStr, out_trade_no } = await getOrderStr(value, userId);
    res.send({
      status: "success",
      msg: "获取订单信息成功",
      data: orderStr,
    });

    return await getAliOrderResult(out_trade_no, userId, trueValue);
  } catch (error) {
    console.log(error);
    return res.send({ status: "refuse", msg: "获取订单信息失败", data: null });
  }
};

//获取请求的客户端ip
const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  );
};
/**
 * Represents a book.
 * @constructor
 * @param {value} Number - 订单数额
 *
 */
exports.getCharge = async (req, res) => {
  const { userId } = req;
  const { value } = req.body;
  try {
    let schema = await getScheme(value, userId);
    res.send({
      status: "success",
      msg: "获取订单链接成功",
      data: schema,
    });
  } catch (error) {}
  // try {
  //   const ip = getClientIp(req);
  //   const pingpp = Pingpp("sk_test_4qPiHSrX54yTWL8C48zHSaLS");
  //   pingpp.setPrivateKey(
  //     "MIICXgIBAAKBgQCgHA1Z0ZoG+tSGDbAeorSNN6/zRWCSDRu3+73aSrnpNXIivLPG" +
  //       `7vekZzvT48Cy6gMg5m9MNJfnCSU5RIUPvhKQ4pWYhRmNF3XiYArd4lzPzZAYQKxB` +
  //       "Yw1LoAssaHc9nppGrZr7DlSKCGMpIvH9FpJXrAWS9n08eABou1TnrBB8nwIDAQAB" +
  //       "NnGVnvSEb1mD9/T3Oi8tx2R+yEQiqfRdziWWjRmD4DpPyXd3SwZNYsgP7lNaTnij" +
  //       "VBAML9XoGSmUAHZN9aYPBEUyje5JzSlQD4FWkyUb4ZGK8GKxAkEA0Xh2S3PSzMoB" +
  //       "x9J63d8hYRaBDhIN7O67tapRHvtMR2iwk16GSwJ9LfFG0M9LCmHzcl/NJVprRA1h" +
  //       "xswFA98yIwJBAMOsres1+Dyo0dQ1ml9YHABzvG8QfnGaL8Td6r9VR9VNCD0QIfUN" +
  //       "6mWayGiYMY/vkih3J4wxInGW9f6JCV3bvVUCQBnHCj+0zC85eMifZVFigRgSjeUu" +
  //       "YZpTsrPjdsIqSLPM9VXdXwdiEgeSVpWhvOlVLoFXusYq/2JLh0nQl5lnYSMCQQCJ" +
  //       "LbEL+d0a4Zug8ydTeli/NGRBVMXgbKDaml1tX6MpdYS2Em5L90KBkr63HSN57hGA" +
  //       "TvCpxvSHv7abiITJiTi1AkEAhsFb5npG2kEalRqD80ddRq7xS+l/Cv08EhTgyMNn" +
  //       "9ZzMR2PmQ2PhZm7Fi+fybsXvZ1d08UEd+xwcit5L1sTIeg=="
  //   );
  //   let chargeObj;
  //   pingpp.charges.create(
  //     {
  //       subject: "区块链充值",
  //       body: `￥ ${value}`,
  //       amount: value * 100,
  //       order_no: "123456789",
  //       channel: type,
  //       currency: "cny",
  //       client_ip: ip,
  //       app: { id: "app_j5uPyPLmnDKCjHuD" },
  //     },
  //     (err, charge) => {
  //       if (err) {
  //         console.log(err);
  //         return new Error(err);
  //       }
  //       return res.send({
  //         status: "success",
  //         msg: "获取订单信息成功",
  //         data: chargeObj,
  //       });
  //     }
  //   );
  // } catch (error) {
  //   console.error(error);
  //   return res.send({
  //     status: "refuse",
  //     msg: "获取订单信息失败",
  //     data: null,
  //   });
  // }
};
