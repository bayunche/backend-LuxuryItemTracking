const express = require("express");
const router = express.Router();
const login = require("./login");

router.post("/login", login.login);
router.post("/resign", login.signup);
module.exports = router;
