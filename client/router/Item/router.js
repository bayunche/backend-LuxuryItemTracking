
const express = require("express");
const router = express.Router();
const item=require("./item");

router.get("/getItemList", item.getItemList);
router.get("/getItemDetails",item.getItemDetails)
router.get("/getLogisticsInfo",item.getLogisticsInfo)
router.get("/getLogisticsList",item.getLogisticsList)
router.get("/getSalesList",item.getSalesList)
router.get("/getSalesDetail",item.getSalesDetail)
router.delete("/deleteItem",item.deleteItem)
module.exports = router;
