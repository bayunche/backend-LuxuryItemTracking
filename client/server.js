const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs=require("fs");
const https=require("https");
const privateKey = fs.readFileSync("/etc/nginx/cert/www.hasunmiku.top.key", 'utf8');
const certificate = fs.readFileSync("/etc/nginx/cert/www.hasunmiku.top.pem", 'utf8');
const credentials = {key: privateKey, cert: certificate};
const {jwtcheck} = require("./middleWare/jwtCheck");
const bodyParser = require("body-parser");
const {
  connectDatabase,
  closeDatabaseConnection,
} = require("./data/UserDatabase");
const login = require("./router/login/router");
const certify = require("./router/certify/router");
const user=require("./router/user/router");
const item =require("./router/Item/router");
connectDatabase().then((dataBase) => {
  closeDatabaseConnection(dataBase);
  console.log("DBTESTcomplete");
});

app.use(bodyParser.urlencoded({ extended: true,limit:"150mb" }));
app.use(bodyParser.json({limit:"150mb"}));
app.use(cors());
//
// app.use(jwtcheck)

// 中间件使用
app.use(
  "/certify",
  function (req, res, next) {
    jwtcheck(req, res, next);
  }
);
app.use(
  "/user",
  function (req, res, next) {
    jwtcheck(req, res, next);
  }
 
);

app.use(
  "/item",
  function (req, res, next) {
    jwtcheck(req, res, next);
  }
);

app.use("/auth", login);
app.use("/user", user);
app.use("/item", item);
app.use("/certify", certify);
const port = 3101;
// 本地环境
// app.listen(port, (error) => {
//   console.log("server is running on port " + port);
//   if (error) {
//     console.log(error);
//   }
// });

// 生产环境
const httpsServer = https.createServer(credentials,app);
httpsServer.listen(port, function() {
  console.log(`HTTPS Server is running on: https://localhost:${port},certyfy:${credentials}`);
});



