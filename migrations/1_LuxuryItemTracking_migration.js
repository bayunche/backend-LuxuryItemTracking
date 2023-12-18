const LuxuryItemTracking = artifacts.require("LuxuryItemTracking");
const initialMirgation = artifacts.require("Migrations");
module.exports =async function (deployer) {
  deployer.deploy(initialMirgation);
  const baseURI = "127.0.0.1";
  const name = "LuxuryItems";
  const symbol = "LUX";
  deployer.deploy(LuxuryItemTracking, baseURI, name, symbol);
};
