const express = require("express");
const router = express.Router();
const user = require("./user");

router.get("/signupUser", user.createUserPrivateKey);
router.get("/certifiedUser", user.certifiedUser);
router.get("/getUserInfo", user.getUserInfo);

module.exports = router;
