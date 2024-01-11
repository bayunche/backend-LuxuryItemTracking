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
const qrcode = require("qrcode");
const salesInfo = require("../../data/salesInfo");

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

      let dataStr = JSON.stringify({
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
      let qrcodeBase64 = await qrcode.toDataURL(dataStr);
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
        qrcode: qrcodeBase64,
      });
      console.log("QR code and details stored in MySQL database");
      res.send({
        itemId,
        serialNumber,
        qrcode: qrcodeBase64,
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
    let { transactionHash, blockNumber, timestamp } = await updateLogisticsInfo(
      serialNumber,
      String(logisticsInfo),
      address
    );
    await ItemList.update(
      {
        startPoint,
        endPoint,
        TransportWay,
        TransportCompany,
        TransportDate,
        TransportNumber,
        status,
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
      transactionHash,
      blockNumber,
      timestamp,
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

exports.updateSalesRecord = async (req, res) => {
  // 从请求体中获取销售时间、物品id、销售价格、分销渠道、销售渠道
  let {
    salesTime,
    itemId,
    salesPrice,
    distributionChannel,
    salesOutlet,
    salesStatus,
  } = req.body;
  // 获取用户id
  salesTime = new Date(salesTime);
  let userId = req.userId;
  try {
    let item = await ItemList.findByPk(itemId);
    let user = await User.findByPk(userId);
    user = item.toJSON();
    item = item.toJSON();
    let { serialNumber } = item;
    let { address } = user;
    let salesData = {
      salesTime,
      itemId,
      salesPrice,
      distributionChannel,
      salesOutlet,
    };

    // 创建销售记录
    let transactionInfo = await updateSalesRecord(
      serialNumber,
      String(salesData),
      address
    );
    let { transactionHash, blockNumber, timestamp } = transactionInfo;
    await ItemList.update(
      {
        salesTime,
        itemId,
        salesPrice,
        distributionChannel,
        salesOutlet,
      },
      { where: { itemId: itemId } }
    );
    salesInfo.create({
      salesId: ulid(),
      ...salesData,
      ...transactionInfo,
    });
    res.send({
      msg: "更新销售信息成功",
      data: null,
      error: null,
    });
  } catch (error) {
    console.log(error);

    res.send({
      msg: "更新销售信息失败",
      data: null,
      error,
    });
  }
};
