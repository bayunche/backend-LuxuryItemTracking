const express = require("express");
const router = express.Router();
const login = require("./login");

router.post("/login", login.login);
router.post("/signup", login.signup);
router.get("/topup", login.getTopUp);

module.exports = router;
