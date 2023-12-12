const LuxuryItemTracking = artifacts.require("LuxuryItemTracking");
const initialMirgation = artifacts.require("Migrations");
const web3 = require('web3');

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
