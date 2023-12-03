// const { connect } = require("http2");
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

exports.mintLuxuryItem = async (req, res) => {
  const { itemName, itemDate, itemImage } = req.body;
  const userId = req.userId;
  let serialNumer = generateSecureRandomNumber();
  let result = await User.findByPk(userId);
  try {
    if (result != null) {
      // const { privateKey } = result.toJSON();
      result = result.toJSON();
      let { privateKey } = result;
      console.log(privateKey);
      privateKey = privateKey.toString();
      let itemId = await mintNFTs(
        itemName,
        serialNumer,
        itemDate,
        itemImage,
        privateKey
      );
      await certifyUser(serialNumer, privateKey);
      await ItemList.create({
        itemId: ulid(),
        userName: result.userName,
        serialNumer,
        itemName,
        itemDate,
        itemImage,
        userId,
        createTime: now(),
      });
      res.send({
        itemId,
        msg: "success",
      });
    } else {
      res.send({
        status: 400,
        msg: "请先注册区块链账户",
      });
    }
  } catch (error) {
    throw error;
  }
};
exports.getItemDetails = async (req, res) => {
  const { serialNumer } = req.body;
  let result = await getLuxuryItemDetails(serialNumer);
  res.send({
    result,
    msg: "success",
  });
};
exports.isExists = async (req, res) => {
  const { serialNumer } = req.body;
  let result = await isLuxuryItemExists(serialNumer);
  res.send({
    result,
    msg: "success",
  });
};
exports.createUserPrivateKey = async (req, res) => {
  console.log(req.userId);
  const userId = req.userId;
  // const newAccount = web3.eth.accounts.create();
  // const privateKey = newAccount.privateKey;

  let user = await User.findByPk(userId);
  user = user.toJSON();
  console.log(user);
  if (!user.privateKey) {
    let newPrivateKey = await createAccount();
    console.log(newPrivateKey);
    let result = await User.update(
      { privateKey: newPrivateKey },
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
