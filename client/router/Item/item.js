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
    });
    let { serialNumber, tokenId } = itemData;
    console.log(typeof tokenId, tokenId);
    let { privateKey } = await User.findOne({ where: { userId: userId } });
    // let result = await getLuxuryItemDetails(tokenId, privateKey);
    let result = await getLuxuryDetails(tokenId, privateKey);
    // itemData = JSONBig.stringify(itemData);
    console.log(result);
    res.send({
      data: { itemData, result },
      data: itemData,
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
  let { itemId } = req.params;
  if (itemId == null) {
    return res.send({
      status: "refuse",
      msg: "参数错误",
      data: null,
    });
  }
  let { userId } = req;
  let { permission } = User.findOne({ where: { userId } });
  if (permission != 1) {
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
  } else if (permission == 1) {
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
