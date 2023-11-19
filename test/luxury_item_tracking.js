const LuxuryItemTracking = artifacts.require("LuxuryItemTracking");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("LuxuryItemTracking", function (/* accounts */) {
  it("should assert true", async function () {
    await LuxuryItemTracking.deployed();
    return assert.isTrue(true);
  });
});
