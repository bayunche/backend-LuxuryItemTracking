const { ulid } = require("ulid");

const { Web3 } = require("web3");
// 加载LuxuryItemTracking合约的ABI
const luxuryItemTrackingABI =
  require("../../build/contracts/LuxuryItemTracking.json").abi;
const web3 = new Web3("http://localhost:7545"); // 替换为你的以太坊节点地址

const contractAddress = "0xB443986272469762A2D72608b261E68B3A1ab509";

const contract = new web3.eth.Contract(luxuryItemTrackingABI, contractAddress);

// 创建NFTs
exports.mintNFTs = async (
  _name,
  _serialNumber,
  _productionDate,
  privateKey
) => {
  try {
    //获取账户列表
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    await contract.methods
      .mintNFTs(_name, _serialNumber, _productionDate)
      .send({
        from: account,
        value: web3.utils.toWei("0.000001", "ether"), // 发行代币需要支付的以太币
      });
    console.log("NFTs minted successfully!");
    return ulid();
  } catch (error) {
    console.error("Error minting NFTs:", error);
  }
};

// 更新物流信息
exports.updateLogisticsInfo = async (
  serialNumber,
  logisticsInfo,
  privateKey
) => {
  try {
    const account = await web3.eth.accounts.privateKeyToAccount(privateKey);

    // 更新物流信息
    await contract.methods
      .updateLogisticsInfo(serialNumber, logisticsInfo)
      .send({
        from: account,
      });

    console.log("Logistics info updated successfully!");
  } catch (error) {
    console.error("Error updating logistics info:", error);
  }
};
// 更新销售记录函数
exports.updateSalesRecord = async (serialNumber, salesRecord, privateKey) => {
  try {
    const account = await web3.eth.accounts.privateKeyToAccount(privateKey);

    // 更新销售记录
    await contract.methods.updateSalesRecord(serialNumber, salesRecord).send({
      from: account,
    });

    console.log("Sales record updated successfully!");
  } catch (error) {
    console.error("Error updating sales record:", error);
  }
};
// 认证奢侈品
exports.certifyUser = async (serialNumber, privateKey) => {
  try {
    // 获取账户列表
    const account = await web3.eth.accounts.privateKeyToAccount(privateKey);
    // 调用认证用户的函数
    await contract.methods.certifyUser(serialNumber).send({
      from: account,
    });

    console.log("User certified successfully!");
  } catch (error) {
    console.error("Error certifying user:", error);
  }
};
// 获取商品信息
exports.getLuxuryItemDetails = async (serialNumber) => {
  try {
    const result = await luxuryItemInstance.methods
      .getItemDetails(serialNumber)
      .call();
    return result;
  } catch (error) {
    throw new Error(`Error getting item details: ${error}`);
  }
};
// 判断奢侈品是否存在
exports.isLuxuryItemExists = async (serialNumber) => {
  try {
    const exists = await contract.methods._exists(serialNumber).call();
    return exists;
  } catch (error) {
    console.error("Error checking if luxury item exists:", error);
    return false;
  }
};
// 创建账户
exports.createAccount = async () => {
  const newAccount = web3.eth.accounts.create();
  console.log(newAccount)
  const privateKey = newAccount.privateKey;
  return privateKey;
};
