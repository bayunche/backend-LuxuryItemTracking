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
const logisticsInfoData = require("../../data/logisticsInfo");
const ItemList = require("../../data/itemList");
const salesInfo = require("../../data/salesInfo");

exports.getItemDetails = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.userId;
  try {
    let address = await User.findOne({ where: { userId: userId } });
    address = address.address;
    console.log(address);
    let serialNumer = await ItemList.findOne({ where: { itemId: itemId } });
    serialNumer = serialNumer.serialNumber;
    let result = await getLuxuryItemDetails(serialNumer, address);
    res.send({
      result,
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
      attributes: ["id","itemName","itemImage", "itemDate", "serialNumber","value"],
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
      data:null,
      status:"refuse"
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
