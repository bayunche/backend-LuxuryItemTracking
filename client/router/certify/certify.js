// const { connect } = require("http2");
const {
  mintNFTs,
  isLuxuryItemExists,
  getLuxuryItemDetails,
  certifyUser,
  updateSalesRecord,
  updateLogisticsInfo,
  createAccount,
  setLuxuryItemCertification,
  setLuxuryItemValuation,
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
const JSONBig = require("json-bigint");

exports.mintLuxuryItem = async (req, res) => {
  let { itemName, itemDate, itemImage } = req.body;
  let userId = req.userId;
  let result = await User.findOne({ where: { userId: userId } });
  // result = result.toJSON();
  let { address, userName } = result;
  try {
    if (address != null) {
      let serialNumber = generateSecureRandomNumber();
      userId = result.userId;
      console.log(address, userId);
      // privateKey = privateKey.toString();
      itemDate = moment(itemDate).unix();
      itemDate = parseInt(itemDate);
      let { itemId, transactionHash, blockNumber, timeStamp } = await mintNFTs(
        itemName,
        serialNumber,
        itemDate,
        address,
        userId
      );

      let dataStr = JSONBig.stringify({
        itemId,
      });
      let qrcodeBase64 = await qrcode.toDataURL(dataStr);
      let data = {
        itemId: ulid(),
        userName: result.userName,
        creater: userName,
        serialNumber,
        itemName,
        itemDate,
        itemImage,
        userId,
        createTime: timeStamp,
        blockNumber,
        transactionHash,
        qrcode: qrcodeBase64,
      };
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === "bigint") {
          console.log(`${key} is a BigInt`);
        }
      }

      await ItemList.create(data);
      console.log("QR code and details stored in MySQL database");

      res.send({
        data: {
          itemId,
          qrcode: qrcodeBase64,
        },
        msg: "注册奢侈品成功",
        status: "success",
      });
    } else {
      res.send({
        status: "refuse",
        msg: "请先注册区块链账户",
      });
    }
  } catch (error) {
    // throw error;
    console.log(error);
    res.send({
      status: "refuse",
      msg: error,
    });
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
  let item = await ItemList.findOne({ where: { itemId: itemId } });
  let user = await User.findOne({ where: { userId: userId } });

  // user = item.toJSON();
  // item = item.toJSON();
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
      createTime: timestamp,
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
    let item = await ItemList.findOne({ where: { itemId: itemId } });
    let user = await User.findOne({ where: { userId: userId } });
    // user = item.toJSON();
    // item = item.toJSON();
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
exports.setLuxuryItemValuation = async (req, res) => {
  const { itemId, valuation } = req.body;
  let userId = req.userId;
  let item = await ItemList.findOne({ where: { itemId: itemId } });
  let user = await User.findOne({ where: { userId: userId } });
  // item = item.toJSON();
  // user = user.toJSON();
  let { serialNumber } = item;
  let { address } = user;
  try {
    let { transactionHash, blockNumber, timestamp } =
      await setLuxuryItemValuation(serialNumber, valuation, address);

    // 更新数据库中的估值信息
    await ItemList.update({ valuation }, { where: { itemId: itemId } });

    res.send({
      msg: "奢侈品估值更新成功",
      data: {
        transactionHash,
        blockNumber,
        timestamp,
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "奢侈品估值更新失败",
      data: null,
      error,
    });
  }
};
exports.setLuxuryItemCertification = async (req, res) => {
  const { itemId, certification } = req.body;
  let userId = req.userId;
  let item = await ItemList.findOne({ where: { itemId: itemId } });
  let user = await User.findOne({ where: { userId: userId } });
  // user = user.toJSON();
  // item = item.toJSON();
  let { serialNumber } = item;
  let { address } = user;

  try {
    let { transactionHash, blockNumber, timestamp } =
      await setLuxuryItemCertification(serialNumber, certification, address);

    // 更新数据库中的认证信息
    await ItemList.update({ certification }, { where: { itemId: itemId } });

    res.send({
      msg: "奢侈品认证信息更新成功",
      data: {
        transactionHash,
        blockNumber,
        timestamp,
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "奢侈品认证信息更新失败",
      data: null,
      error,
    });
  }
};
exports.isCertifiedUser = async (req, res) => {
  const { itemId } = req.body; // 假设前端发送的请求体中包含奢侈品ID
  let userId = req.userId; // 假设通过某种方式获取了请求用户的ID

  // 从数据库中查找奢侈品和用户信息
  let item = await ItemList.findOne({ where: { itemId: itemId } });
  let user = await User.findOne({ where: { itemId: itemId } });

  if (!item || !user) {
    return res.send({
      msg: "无法找到奢侈品或用户信息",
      data: null,
      error: "Item or User not found",
    });
  }

  // user = user.toJSON();
  // item = item.toJSON();

  let { serialNumber } = item; // 获取奢侈品的序列号
  let { address } = user; // 获取用户的区块链地址

  try {
    // 调用智能合约的方法来确认用户是否为认证用户
    const isCertified = await isCertifiedUser(serialNumber, address);

    res.send({
      msg: "认证状态查询成功",
      data: {
        isCertified: isCertified,
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "认证状态查询失败",
      data: null,
      error,
    });
  }
};

exports.listenForEvents = () => {
  // 监听认证信息更新事件
  contract.events.LuxuryItemCertificationUpdated(
    {
      fromBlock: "latest",
    },
    function (error, event) {
      if (error) {
        console.error(
          "Error listening for LuxuryItemCertificationUpdated events",
          error
        );
      } else {
        console.log("LuxuryItemCertificationUpdated event detected:", event);
        // 在这里添加处理事件的逻辑
        // 例如，更新数据库中的认证状态
      }
    }
  );

  // 监听估值更新事件
  contract.events.LuxuryItemValuationUpdated(
    {
      fromBlock: "latest",
    },
    function (error, event) {
      if (error) {
        console.error(
          "Error listening for LuxuryItemValuationUpdated events",
          error
        );
      } else {
        console.log("LuxuryItemValuationUpdated event detected:", event);
        // 在这里添加处理事件的逻辑
        // 例如，更新数据库中的估值信息
      }
    }
  );

  console.log("Started listening for smart contract events.");
};
