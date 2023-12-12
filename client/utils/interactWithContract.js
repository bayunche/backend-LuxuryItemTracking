const { ulid } = require("ulid");

const { Web3 } = require("web3");
const User = require("../data/user");
const { userInfo } = require("os");
// 加载LuxuryItemTracking合约的ABI
const luxuryItemTrackingABI =
  require("../../build/contracts/LuxuryItemTracking.json").abi;
const web3 = new Web3("http://127.0.0.1:8551"); // 替换为你的以太坊节点地址

let contractAddress;

// const contract = new web3.eth.Contract(luxuryItemTrackingABI, contractAddress);

// 创建NFTs
exports.mintNFTs = async (
  _name,
  _serialNumber,
  _productionDate,
  address,
  passphrase
) => {
  try {
    const account = address;
    // 检查账户是否已解锁
    contractAddress = address;
    const isUnlocked = await web3.eth.personal
      .unlockAccount(account, "", 1)
      .catch(() => false);
    const contract = new web3.eth.Contract(
      luxuryItemTrackingABI,
      contractAddress
    );

    if (!isUnlocked) {
      // 账户未解锁，使用提供的密码短语解锁
      await web3.eth.personal.unlockAccount(account, passphrase, 600); // 解锁10分钟
    }

    // 铸造 NFT
    await contract.methods
      .mintNFTs(_name, _serialNumber, _productionDate)
      .send({
        from: account,
        value: web3.utils.toWei("0.000001", "ether"),
      });

    console.log("NFTs minted successfully!");
    return ulid();
  } catch (error) {
    console.error("Error minting NFTs:", error);
  }
};

// 更新物流信息
exports.updateLogisticsInfo = async (serialNumber, logisticsInfo, address) => {
  try {
    const account = address;
    const contract = new web3.eth.Contract(
      luxuryItemTrackingABI,
      contractAddress
    );
    contractAddress = address;

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
exports.updateSalesRecord = async (serialNumber, salesRecord, address) => {
  try {
    const account = address;
    contractAddress = address;

    const contract = new web3.eth.Contract(
      luxuryItemTrackingABI,
      contractAddress
    );

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
exports.certifyUser = async (serialNumber, address) => {
  try {
    // 获取账户列表
    const account = address;
    contractAddress = address;

    // 调用认证用户的函数
    const contract = new web3.eth.Contract(
      luxuryItemTrackingABI,
      contractAddress
    );

    await contract.methods.certifyUser(serialNumber).send({
      from: account,
    });

    console.log("User certified successfully!");
  } catch (error) {
    console.error("Error certifying user:", error);
  }
};
// 获取商品信息
exports.getLuxuryItemDetails = async (serialNumber,address) => {
  try {
    contractAddress = address;

    const contract = new web3.eth.Contract(
      luxuryItemTrackingABI,
      contractAddress
    );

    const result = await contract.methods.getItemDetails(serialNumber).call();
    return result;
  } catch (error) {
    throw new Error(`Error getting item details: ${error}`);
  }
};
// 判断奢侈品是否存在
exports.isLuxuryItemExists = async (serialNumber) => {
  try {
    contractAddress = address;

    const contract = new web3.eth.Contract(
      luxuryItemTrackingABI,
      contractAddress
    );

    const exists = await contract.methods._exists(serialNumber).call();
    return exists;
  } catch (error) {
    console.error("Error checking if luxury item exists:", error);
    return false;
  }
};
// 创建账户
exports.createAccount = async (userId) => {
  let result = await User.findByPk(userId);
  result = result.toJSON();
  const newAccount = await web3.eth.personal.newAccount(result.userId);
  console.log(newAccount);
  const address = newAccount;
  let initAccount = await web3.eth.getAccounts();
  initAccount=initAccount[0]
  console.log(initAccount)
  await web3.eth.sendTransaction({
    from: initAccount,
    to: address,
    value: web3.utils.toWei("10", "ether"),
    gas: '30000',
    gasPrice: web3.utils.toWei("100", "gwei"),

  });
  return address;
};
