const express = require("express");
const router = express.Router();
const user = require("./user");

router.get("/signupUser", user.createUserPrivateKey);

router.post("/getUserInfo", user.getUserInfo);


module.exports = router;
