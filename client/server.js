const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const {jwtcheck} = require("./middleWare/jwtCheck");
const bodyParser = require("body-parser");
const {
  connectDatabase,
  closeDatabaseConnection,
} = require("./data/UserDatabase");
const login = require("./router/login/router");
const certify = require("./router/certify/router");
connectDatabase().then((dataBase) => {
  closeDatabaseConnection(dataBase);
  console.log("DBTESTcomplete");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
//
// app.use(jwtcheck)

// 中间件使用
app.use(
  "/certify",
  function (req, res, next) {
    jwtcheck(req, res, next);
  },
  certify
);

app.use("/auth", login);

const port = 3101;

app.listen(port, (error) => {
  console.log("server is running on port " + port);
  if (error) {
    console.log(error);
  }
});
