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
  console.log(req.userId);
  const userId = req.userId;
  // const newAccount = web3.eth.accounts.create();
  // const privateKey = newAccount.privateKey;

  let user = await User.findByPk(userId);
  user = user.toJSON();
  console.log(user);
  if (!user.address) {
    let address = await createAccount(userId);
    console.log(address);

    let result = await User.update(
      { address: address, balance: "10" },
      {
        where: { userId: user.userId },
      }
    );
    console.log(result);
    if (result != null) {
      res.send({
        status:"success",
        msg: "创建用户权限成功",
        data: null,
      });
    } else {
      res.send({
        status:"refuse",
        msg: "创建用户失败",
        data: null,
      });
    }
  } else {
    res.send({
      msg: "已注册区块链账户",
      status:"refuse",
      data: null,
    });
  }
};

exports.certifiedUser = async (req, res) => {
  const userId = req.userId;
  let user = await User.findByPk(userId);
  user = user.toJSON();
  if (user.address && user.balance) {
    res.send({ status:"success", msg: "用户已注册区块链账户", data: user.address });
  }else{
    res.send({ status:"refuse",msg: "用户未注册区块链账户", data: null });
  }
};

exports.getUserInfo = async (req, res) => {
  const userId = req.userId;
  let userDetail = await User.findByPk(userId);
  userDetail = userDetail.toJSON();
  res.send({
    msg: "获取用户信息成功",
    data: userDetail,
  });
};
