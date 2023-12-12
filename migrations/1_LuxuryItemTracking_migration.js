const LuxuryItemTracking = artifacts.require("LuxuryItemTracking");
const initialMirgation = artifacts.require("Migrations");
const Web3 = require('web3');
const web3 = new Web3("http://127.0.0.1:8545"); // 替换为你的以太坊节点地址

module.exports =async function (deployer, account) {
  deployer.deploy(initialMirgation);
  const baseURI = "127.0.0.1";
  const name = "LuxuryItems";
  const symbol = "LUX";
  console.log("Deployer Account Balance:", web3.utils.fromWei(await web3.eth.getBalance(account[0]), "ether"), "ETH");
  deployer.deploy(LuxuryItemTracking, baseURI, name, symbol, {
    from: account[0],
  });
};
