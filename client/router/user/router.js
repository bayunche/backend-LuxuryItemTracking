const express = require("express");
const router = express.Router();
const user = require("./user");

router.get("/signupUser", user.createUserPrivateKey);
router.get("/certifiedUser", user.certifiedUser);
router.get("/getUserInfo", user.getUserInfo);
router.post('/editPassword',user.editUserPassword)
router.post('/editUserInfo',user.editUserInfo)
module.exports = router;
