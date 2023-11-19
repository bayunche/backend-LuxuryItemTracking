const LuxuryItemTracking = artifacts.require("LuxuryItemTracking");

module.exports = function (deployer) {
  const baseURI = "127.0.0.1";
  const name = "LuxuryItems";
  const symbol = "LUX";
  deployer.deploy(LuxuryItemTracking, baseURI, name, symbol);
}