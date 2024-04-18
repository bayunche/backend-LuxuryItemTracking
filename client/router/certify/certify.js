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
  registerLuxuryItem,
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
const transactionLog = require("../../data/transactionLog");

// 导出mintLuxuryItem函数，用于处理发送的请求
exports.mintLuxuryItem = async (req, res) => {
  // 从请求中获取itemName、itemDate和itemImage
  let { itemName, itemDate, itemImage, brand, model } = req.body;
  // 获取当前用户的userId
  let userId = req.userId;
  // 打印itemDate
  console.log(itemDate);
  // 查询当前用户的信息
  let result = await User.findOne({ where: { userId: userId } });
  // 将查询结果转换为JSON
  // result = result.toJSON();
  let { address, userName, privateKey } = result;
  try {
    // 如果用户已经注册了地址
    if (address != null) {
      // 生成随机数
      // let serialNumber = generateSecureRandomNumber();
      // serialNumber=BigInt(serialNumber)
      // 将用户的userId赋值给serialNumber
      userId = result.userId;
      console.log(address, userId);
      // 将私钥转换为字符串
      // privateKey = privateKey.toString();
      // 将itemDate从ISO 8601格式转换为Unix时间戳
      // 调用mintNFTs函数，生成交易hash
      // let { transactionHash, blockNumber, timeStamp, serialNumber } =
      //   await mintNFTs(itemName, itemDate, address, userId);
      let results = await registerLuxuryItem(
        brand,
        model,
        itemDate,
        address,
        userId,
        privateKey
      );
      let {
        transactionHash,
        blockNumber,
        timeStamp,
        serialNumber,
        balance,
        tokenId,
      } = await results;
      console.log(tokenId);
      // 生成唯一标识符
      let itemId = ulid();
      // 生成二维码
      let codeData = {
        itemId,
      };
      let qrcodeBase64 = await qrcode.toDataURL(JSON.stringify(codeData));
      // 生成数据
      let data = {
        itemId: itemId,
        userName: result.userName,
        creater: userName,
        serialNumber,
        itemName,
        itemDate: itemDate,
        itemImage,
        userId,
        tokenId,
        createTime: timeStamp,
        blockNumber,
        brand,
        model,
        transactionHash,
        qrcode: qrcodeBase64,
      };

      console.log(data);
      // 将数据存入MySQL数据库
      await ItemList.create(data);
      // 创建交易记录
      let transactionLogData = {
        transactionHash,
        itemId,
        itemName,
        creater: userName,
        userId,
        createTime: moment().unix(),
        blockNumber,
        serialNumber,
        description: "注册奢侈品",
      };
      await transactionLog.create(transactionLogData);
      await User.update({ balance }, { where: { userId: userId } });
      console.log("QR code and details stored in MySQL database");
      // 返回二维码和详情给前端
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
    // 抛出错误
    console.log(error);
    res.send({
      status: "refuse",
      msg: error,
    });
  }
};

exports.isExists = async (req, res) => {
  const { itemId } = req.query;
  let { serialNumber } = ItemList.findOne({ where: { itemId: itemId } });
  let result = await isLuxuryItemExists(serialNumber);
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
    remark,
  } = req.body;
  if (!itemId) {
    return res.send({
      msg: "请输入物品id",
      data: null,
      error: null,
    })
  }
  let userId = req.userId;
  let item = await ItemList.findOne({ where: { itemId: itemId } });
  let user = await User.findOne({ where: { userId: userId } });
  let { tokenId } = item;
  let { privateKey, address, userName } = user;
  let data = {
    shippingDate: TransportDate,
    carrier: TransportCompany,
    trackingNumber: TransportNumber,
    status: status,
  };
  try {
    let { transactionHash, blockNumber, timestamp, balance } =
      await updateLogisticsInfo(tokenId, data, privateKey, address);
    await ItemList.update(
      {
        logistics_id: ulid(),
        startPoint,
        endPoint,
        TransportWay,
        TransportCompany,
        TransportDate,
        TransportNumber,
        status:2,
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
      timestamp: moment(timestamp).unix(),
      logistics_status: status,
      createTime: timestamp,
      creater: userId,
      remark,
    });
    await transactionLog.create({
      creater: userName,
      itemName: item.itemName,
      itemId: item.itemId,
      userId: user.userId,
      createTime: timestamp,
      serialNumber: item.serialNumber,
      blockNumber: blockNumber,
      transactionHash,
      description: "更新物流信息",
    });
    await user.update({ balance }, { where: { userId: userId } });
    res.send({
      status: "success",
      msg: "更新物流信息成功",
      data: null,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status:"refuse",
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
    buyer,
    remark
  } = req.body;
  // 获取用户id
  salesTime = new Date(salesTime);
  let userId = req.userId;
  try {
    let item = await ItemList.findOne({ where: { itemId: itemId } });
    let user = await User.findOne({ where: { userId: userId } });
    let { tokenId } = item;
    let { address, privateKey, userName } = user;
    let salesData = {
      salesTime,
      itemId,
      salesPrice,
      distributionChannel,
      salesOutlet,
      salesStatus,
      remark
    };
    let data = {
      salesDate: salesTime,
      price: salesPrice,
      buyer: buyer,
    };
    // 创建销售记录
    let { transactionHash, blockNumber, timestamp, balance } =
      await updateSalesRecord(tokenId, data, address, privateKey);
    console.log(transactionHash);
    await ItemList.update(
      {
        salesTime,
        itemId,
        salesPrice,
        distributionChannel,
        salesOutlet,
        status:3,
      },
      { where: { itemId: itemId } }
    );
    await salesInfo.create({
      salesId: ulid(),
      ...salesData,
      transactionHash,
      blockNumber,
      timestamp: moment(timestamp).unix(),
    });
    await User.update({ balance }, { where: { userId: userId } });
    await transactionLog.create({
      creater: userName,
      itemName: item.itemName,
      itemId: item.itemId,
      userId: user.userId,
      createTime: timestamp,
      serialNumber: item.serialNumber,
      blockNumber: blockNumber,
      transactionHash,
      description: "更新销售信息",
    });

    res.send({
      status: "success",
      msg: "更新销售信息成功",
      data: null,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "refuse",
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
