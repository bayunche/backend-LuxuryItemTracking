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
const moment = require("moment");
const logisticsInfoData = require("../../data/logisticsInfo");
const router = require("./router");

exports.mintLuxuryItem = async (req, res) => {
  let { itemName, itemDate, itemImage } = req.body;
  let userId = req.userId;

  let result = await User.findByPk(userId);
  result = result.toJSON();
  let { address } = result;
  try {
    if (address != null) {
      // const { privateKey } = result.toJSON();
      let serialNumber = generateSecureRandomNumber();
      userId = result.userId;
      console.log(address, userId);
      // privateKey = privateKey.toString();
      itemDate = moment(itemDate).unix();
      itemDate = parseInt(itemDate);
      let itemId = await mintNFTs(
        itemName,
        serialNumber,
        itemDate,
        address,
        userId
      );

      let { transactionHash, blockNumber, timeStamp } = await certifyUser(
        serialNumber,
        address
      );
      await ItemList.create({
        itemId: ulid(),
        userName: result.userName,
        serialNumber,
        itemName,
        itemDate,
        itemImage,
        userId,
        createTime: timeStamp,
        blockNumber,
        transactionHash,
      });
      res.send({
        itemId,
        serialNumber,
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
  const { serialNumer } = req.params;
  const userId = req.userId;
  let address = await User.findByPk(userId);
  address = address.address;
  console.log(address);
  let result = await getLuxuryItemDetails(serialNumer, address);
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
exports.updateLogisticInfo = async (req, res) => {
  const {
    itemId,
    startPoint,
    endPoint,
    TransportWay,
    TransportCompany,
    TransportDate,
    TransportNumber,
    errorMessage,
    status,
  } = req.body;
  let userId = req.userId;
  let item = await ItemList.findByPk(itemId);
  let user = await User.findByPk(userId);
  user = item.toJSON();
  item = item.toJSON();
  let { serialNumber } = item;
  let { address } = user;
  let logisticsInfo = {
    startPoint,
    endPoint,
    TransportWay,
    TransportCompany,
    TransportDate,
    TransportNumber,
    errorMessage,
    status,
  };
  try {
   let transactionHash=  await updateLogisticsInfo(serialNumber, logisticsInfo, address);
    await ItemList.update(
      {
        startPoint,
        endPoint,
        TransportWay,
        TransportCompany,
        TransportDate,
        TransportNumber,
        status,
        transactionHash,
      },
      { where: { itemId: itemId } }
    );
    await logisticsInfoData.create({
      logistics_id: ulid(),
      itemId,
      startPoint,
      endPoint,
      TransportWay,
      TransportCompany,
      TransportDate,
      TransportNumber,
      status,
      errorMessage,
      logistics_status: 1,
      createTime: now(),
      creater: userId,
    });

    res.send({
      msg: "更新物流信息成功",
      data: null,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "更新物流信息失败",
      data: null,
      error,
    });
  }
};

exports.getLogisticsInfo = async (req, res) => {
  let { itemId } = req.params;
  logisticsInfoData
    .findAll({
      where: {
        itemId,
      },
      order: [["createTime", "DESC"]],
    })
    .then(async (data) => {
      data = await data.toJSON();
      res.send({
        msg: "获取物流信息成功",
        data: data,
        error: null,
      });
    });
};

exports.getItemList = async (req, res) => {
  let userId = req.userId;
  let { pageNum, pageSize } = req.params;
  let data = await ItemList.findAll({
    where: {
      userId,
      limit: pageSize,
      offset: pageSize * pageNum - 1,
    },
  });
  data = data.toJSON();
  res.send({
    msg: "获取物品列表成功",
    data,
    error: null,
  });
};

exports.updateSalesRecord = async (req, res) => {
  let { salesTime, itemId, salesPrice, distributionChannel, salesOutlet } =
    req.body;
  let userId = req.userId;
};
