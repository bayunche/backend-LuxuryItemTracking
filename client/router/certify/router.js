const express = require("express");
const router = express.Router();
const certiy = require("./certify");

router.post("/mintLuxuryItem", certiy.mintLuxuryItem);
router.get("/isExists", certiy.isExists);
router.post("/updateLogistics", certiy.updateLogisticInfo);
router.post("/updateSalesRecord", certiy.updateSalesRecord);
router.post("/updateItemInfo", certiy.updateItemInfo);

module.exports = router;
