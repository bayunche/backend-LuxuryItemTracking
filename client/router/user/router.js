const express = require("express");
const router = express.Router();
const user = require("./user");

router.post("/signupUser", user.createUserPrivateKey);
router.get("/certifiedUser", user.certifiedUser);
router.get("/getUserInfo", user.getUserInfo);
router.post('/editPassword',user.editUserPassword)
router.post('/editUserInfo',user.editUserInfo)
router.post("/getAliOrderInfo",user.getAliOrderInfo)
router.post("/getCharge",user.getCharge)
router.get("/getTransactionLogList", user.getTransactionLogList);
router.get("/getTransactionLog", user.getTransactionLog);

module.exports = router;
