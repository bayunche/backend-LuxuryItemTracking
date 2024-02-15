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
        msg: "success",
        data: null,
      });
    } else {
      res.send({
        msg: "failed",
        data: null,
      });
    }
  } else {
    res.send({
      msg: "已注册区块链账户",
      data: null,
    });
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
