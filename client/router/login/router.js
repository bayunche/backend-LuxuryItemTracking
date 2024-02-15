const express = require("express");
const router = express.Router();
const login = require("./login");

router.post("/login", login.login);
router.post("/signup", login.signup);
// router.post("/getUserInfo", login.getUserInfo);


module.exports = router;
