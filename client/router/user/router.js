const express = require("express");
const router = express.Router();
const user = require("./user");

router.get("/signupUser", user.createUserPrivateKey);
router.get("/certifiedUser", user.certifiedUser);
router.get("/getUserInfo", user.getUserInfo);
router.post('/editPassword',user.editUserPassword)
router.post('/editUserInfo',user.editUserInfo)
router.post("/getAliOrderInfo",user.getAliOrderInfo)
router.post("getCharge",user.getCharge)
module.exports = router;
