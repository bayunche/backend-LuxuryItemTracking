const fs = require("fs");
const path = require("path");
const LuxuryItemTracking = artifacts.require("LuxuryGoodsNFT");
const initialMirgation = artifacts.require("Migrations");
module.exports = async function (deployer) {
  await deployer.deploy(initialMirgation);
  const baseURI = "127.0.0.1";
  const name = "LuxuryItems";
  const symbol = "LUX";
  await deployer.deploy(LuxuryItemTracking, baseURI, name, symbol);
  const instance = await LuxuryItemTracking.deployed();
  const config = {
    address: instance.address,
    baseURI: baseURI,
    name: name,
    symbol: symbol,
  };
  const outputPath = path.resolve(
    __dirname,
    "../",
    "client",
   
    "contract-config.json"
  );
  fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
};
