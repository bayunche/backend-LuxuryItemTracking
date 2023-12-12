//下载express  npm i express -S
const express = require("express");
const app = express();
const port = 3010;

const { Web3 } = require("web3");
const web3 = new Web3("http://localhost:8545");
const password = "01HGSCEX5PG5062RJ0950SDAE5";
const account = "0xC74c7721ec35413320c375755a29d6e3E650Cd08";
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, async () => {
  console.log(`Server running at  http://127.0.0.1:${port}`);
  console.log(await account);
  //   console.log(await web3.eth.getAccounts(account))
  console.log(await web3.eth.personal.unlockAccount(account, password, 600))
  // web3.eth.accounts.privateKeyToAccount(account)
});
