const {
  mintNFTs,
  isLuxuryItemExists,
  getLuxuryItemDetails,
  certifyUser,
  updateSalesRecord,
  updateLogisticsInfo,
  createAccount,
  getLuxuryDetails,
} = require("../../utils/interactWithContract");
const User = require("../../data/user");
const logisticsInfoData = require("../../data/logisticsInfo");
const ItemList = require("../../data/itemList");
const salesInfo = require("../../data/salesInfo");
const JSONBig = require("json-bigint");

exports.getItemDetails = async (req, res) => {
  console.log(req.query);
  const { itemId } = req.query;
  const userId = req.userId;
  try {
    let { address } = await User.findOne({ where: { userId: userId } });
    let itemData = await ItemList.findOne({
      where: { itemId: itemId },
      raw: false,
    });
    itemData = itemData.toJSON();
    //从数据库中获取最新的销售信息的区块号
    let salesInfos = await salesInfo.findOne({
      where: { itemId: itemId },
      order: [["createdAt", "DESC"]],
    });
    let logisticsInfos = await logisticsInfoData.findOne({
      where: { itemId: itemId },
      order: [["createdAt", "DESC"]],
    });
    let { serialNumber, tokenId } = itemData;
    let { privateKey } = await User.findOne({ where: { userId: userId } });
    // let result = await getLuxuryItemDetails(tokenId, privateKey);
    let result = await getLuxuryDetails(tokenId, privateKey);
    // itemData = JSONBig.stringify(itemData);

    res.send({
      data: {
        ...itemData,
        salesInfoBlockNumber: salesInfos?.blockNumber || null,
        salesInfo_status: salesInfos?.status || null,
        logisticsInfoBlockNumber: logisticsInfos?.blockNumber || null,
        logistics_status: logisticsInfos?.logistics_status || null,
      },
      // data: itemData,
      msg: "success",
    });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "获取物品详情信息失败",
      data: null,
      error,
    });
  }
};

exports.getLogisticsInfo = async (req, res) => {
  let { itemId } = req.params;
  try {
    logisticsInfoData
      .findAll({
        where: {
          itemId,
        },
        order: [["createTime", "DESC"]],
      })
      .then(async (data) => {
        // data = await data.toJSON();
        res.send({
          msg: "获取该物品物流信息成功",
          data: data,
          error: null,
        });
      });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "获取该物品物流详情信息失败",
      data: null,
      error,
    });
  }
};
exports.getItemList = async (req, res) => {
  let userId = req.userId;
  // let { pageNum, pageSize } = req.params;
  let { itemName } = req.query;
  if (!itemName) {
    try {
      let data = await ItemList.findAll({
        attributes: [
          "id",
          "itemId",
          "itemName",
          "itemImage",
          "itemDate",
          "value",
        ],
        order: [["itemDate", "DESC"]],

        where: {
          // limit: pageSize,
          // offset: pageSize * pageNum - 1,
          userId,
        },
      });
      // if (data.length === 0) {
      //   data = data.toJSON();

      // }
      console.log(data);
      res.send({
        msg: "获取物品列表成功",
        data,
        error: null,
      });
    } catch (error) {
      console.log(error);
      res.send({
        msg: "获取物品列表失败",
        data: null,
        status: "refuse",
      });
    }
  } else {
    try {
      let data = await ItemList.findAll({
        attributes: [
          "id",
          "itemId",
          "itemName",
          "itemImage",
          "itemDate",
          "value",
        ],
        order: [["itemDate", "DESC"]],
        where: {
          // limit: pageSize,
          // offset: pageSize * pageNum - 1,
          userId,
          itemName,
        },
      });
      console.log(data);
      res.send({
        msg: "获取物品列表成功",
        data,
        error: null,
      });
    } catch (error) {
      console.log(error);
      res.send({
        msg: "获取物品列表失败",
        data: null,
        status: "refuse",
      });
    }
  }
};
exports.getLogisticsList = async (req, res) => {
  let { pageNum, pageSize } = req.params;
  let userId = req.userId;
  try {
    let data = await logisticsInfoData.findAll({
      where: {
        limit: pageSize,
        offset: pageSize * pageNum - 1,
      },
    });
    // data = data.toJSON();
    res.send({
      msg: "获取物流信息列表成功",
      data,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "获取物流信息列表成功",
      data,
      error: null,
    });
  }
};

exports.getSalesDetail = async (req, res) => {
  let { salesId } = req.params;
  try {
    let data = salesInfo.findOne({ where: { salesId: salesId } });
    // data = data.toJSON();
    res.send({
      msg: "获取销售信息详情成功",
      data,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "获取销售信息详情失败",
      data: null,
      error: error,
    });
  }
};
exports.getSalesList = async (req, res) => {
  let { pageNum, pageSize } = req.params;

  try {
    let data = await salesInfo.findAll({
      where: {
        limit: pageSize,
        offset: pageSize * pageNum - 1,
      },
    });
    // data = data.toJSON();
    res.send({
      msg: "获取销售信息列表成功",
      data,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.send({
      msg: "获取销售信息列表失败",
      data: null,
      error: error,
    });
  }
};

exports.deleteItem = async (req, res) => {
  let { itemId } = req.query;
  console.log(req.query);
  if (itemId == null) {
    return res.send({
      status: "refuse",
      msg: "参数错误",
      data: null,
    });
  }
  let { userId } = req;
  let { permission } = User.findOne({ where: { userId } });
  if (permission == 0) {
    let result = await ItemList.findOne({
      where: { itemId, userId: req.userId },
    });
    if (result == null) {
      return res.send({
        status: "refuse",
        msg: "该物品不存在或暂无删除权限",
        data: null,
      });
    }
  } else if (permission != 0) {
    let result = await ItemList.findOne({
      where: { itemId },
    });
    if (result == null) {
      return res.send({
        status: "refuse",
        msg: "该物品不存在",
        data: null,
      });
    }
  }

  await ItemList.destroy({ where: { itemId } });
  let updateCount = await ItemList.count({ where: { itemId } });
  console.log(updateCount);
  if (updateCount == 0) {
    return res.send({
      status: "success",
      msg: "删除物品信息成功",
      data: null,
    });
  }
};
exports.getBanner = async (req, res) => {
  let { userId } = req;
  try {
    let result = ItemList.findAll({
      where: { userId: userId },
      attributes: { include: ["value", "itemName", "itemImage", "createdAt"] },
      limit: 5,
      //按照时间升序
      order: [["createdAt", "DESC"]],
    });

    console.log(result);

    res.send({
      status: "success",
      msg: "获取轮播图成功",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "refuse",
      msg: "获取轮播图失败",
      data: null,
    });
  }
};
