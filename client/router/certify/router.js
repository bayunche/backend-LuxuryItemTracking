const express = require("express");
const router = express.Router();
const certiy = require("./certify");

router.post("/mintLuxuryItem", certiy.mintLuxuryItem);
router.get("/isExists", certiy.isExists);
router.get("/signupUser", certiy.createUserPrivateKey);
router.post("/updateLogistics", certiy.updateLogisticInfo);
router.post("/updateSalesRecord", certiy.updateSalesRecord);

module.exports = router;
