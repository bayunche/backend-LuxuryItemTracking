const { ulid } = require("ulid");

const { Web3 } = require("web3");
const User = require("../data/user");
const { userInfo } = require("os");
// 加载LuxuryItemTracking合约的ABI
const luxuryItemTrackingABI =
  require("../../build/contracts/LuxuryItemTracking.json").abi;
const web3 = new Web3("http://127.0.0.1:8548"); // 替换为你的以太坊节点地址

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
      // 如果账户未解锁，使用提供的密码短语解锁
      await web3.eth.personal.unlockAccount(account, passphrase, 600); // 解锁10分钟
    }

    // 铸造 NFT
    const transaction = await contract.methods
      .mintNFTs(_name, _serialNumber, _productionDate)
      .send({
        from: account,
        value: web3.utils.toWei("0.000001", "ether"),
      });

    // 获取交易哈希、区块高度和时间戳
    const transactionHash = transaction.transactionHash;
    const blockNumber = transaction.blockNumber;
    const timestamp = (await web3.eth.getBlock(blockNumber)).timestamp;

    console.log("NFTs minted successfully!");

    // 返回生成的唯一标识符、交易哈希、区块高度和时间戳
    return {
      ulid: ulid(),
      transactionHash: transactionHash,
      blockNumber: blockNumber,
      timestamp: timestamp,
    };
  } catch (error) {
    console.error("Error minting NFTs:", error);
  }
};

// 更新物流信息
exports.updateLogisticsInfo = async (serialNumber, logisticsInfo, address) => {
  try {
    // 获取以太坊账户地址
    const account = address;

    // 使用提供的 ABI（应用二进制接口）和合约地址创建一个合约实例
    const contract = new web3.eth.Contract(
      luxuryItemTrackingABI,
      contractAddress
    );

    // 设置合约地址（这一行似乎放错地方，可能会导致混淆，因为 contractAddress 在代码片段中没有定义）
    contractAddress = address;

    // 在智能合约中更新物流信息
    const transaction = await contract.methods
      .updateLogisticsInfo(serialNumber, logisticsInfo)
      .send({
        from: account,
      });

    // 获取交易哈希
    const transactionHash = transaction.transactionHash;

    console.log("物流信息更新成功！交易哈希:", transactionHash);

    return {
      transactionHash: transaction.transactionHash,
      blockNumber: transaction.blockNumber,
      timestamp: (await web3.eth.getBlock(transaction.blockNumber)).timestamp,
    };
  } catch (error) {
    // 在执行合约方法时处理错误
    console.error("更新物流信息时出错：", error);
    throw error; // 可以选择抛出错误，以便在调用方处理
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
    let transactionInfo = await contract.methods
      .updateSalesRecord(serialNumber, salesRecord)
      .send({
        from: account,
      });
    console.log("Sales record updated successfully!");

    return {
      transactionHash: transaction.transactionHash,
      blockNumber: transaction.blockNumber,
      timestamp: (await web3.eth.getBlock(transaction.blockNumber)).timestamp,
    };
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
    if (!isLuxuryItemExists(serialNumber)) {
      return false;
    }
    // 调用认证用户的函数
    const contract = new web3.eth.Contract(
      luxuryItemTrackingABI,
      contractAddress
    );

    await contract.methods.certifyUser(serialNumber).send({
      from: account,
    });
    return {
      transactionHash: transaction.transactionHash,
      blockNumber: transaction.blockNumber,
      timestamp: (await web3.eth.getBlock(transaction.blockNumber)).timestamp,
    };
    console.log("User certified successfully!");
  } catch (error) {
    console.error("Error certifying user:", error);
  }
};
// 获取商品信息
exports.getLuxuryItemDetails = async (serialNumber, address) => {
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
  console.log(result);
  const newAccount = await web3.eth.personal.newAccount(result.userId);
  
  const address = newAccount;
  let initAccount = await web3.eth.getAccounts();
  initAccount = initAccount[0];
  console.log(initAccount);
  await web3.eth.sendTransaction({
    from: initAccount,
    to: address,
    value: web3.utils.toWei("10", "ether"),
    gas: "30000",
    gasPrice: web3.utils.toWei("100", "gwei"),
  });
  return address;
};
exports.setLuxuryItemValuation = async (
  serialNumber,
  valuation,
  ownerAddress
) => {
  try {
    const transaction = await contract.methods
      .setLuxuryItemValuation(serialNumber, valuation)
      .send({
        from: ownerAddress,
      });
    console.log("Valuation set successfully!");
    return {
      transactionHash: transaction.transactionHash,
    };
  } catch (error) {
    console.error("Error setting valuation:", error);
    throw error;
  }
};
exports.setLuxuryItemCertification = async (serialNumber, certification, ownerAddress) => {
  try {
    const transaction = await contract.methods.setLuxuryItemCertification(serialNumber, certification).send({
      from: ownerAddress,
    });
    console.log("Certification set successfully!");
    return {
      transactionHash: transaction.transactionHash,
    };
  } catch (error) {
    console.error("Error setting certification:", error);
    throw error;
  }
};
exports.isCertifiedUser = async (serialNumber, userAddress) => {
  try {
    const isCertified = await contract.methods.isCertifiedUser(serialNumber).call({
      from: userAddress,
    });
    console.log(`Is the user certified? ${isCertified}`);
    return isCertified;
  } catch (error) {
    console.error("Error checking if user is certified:", error);
    throw error;
  }
};
exports.listenForEvents = () => {
  contract.events.allEvents({
    fromBlock: 'latest'
  }, function(error, event) {
    if (error) console.error(error);
    console.log(event);
  });
};

// // 获取账户列表（需要有挖矿权限的账户）
// async function getAccounts() {
//   try {
//     const accounts = await web3.eth.getAccounts();
//     console.log('Accounts with mining permission:', accounts);
//     return accounts;
//   } catch (error) {
//     console.error('Error fetching accounts:', error);
//     throw error;
//   }
// }

// // 创建账户、设置余额并返回账户信息
// async function createAndFundAccount() {
//   try {
//     // 生成新的账户
//     const newAccount = await web3.eth.accounts.create();

//     console.log('New Account Created:');
//     console.log('Address:', newAccount.address);
//     console.log('Private Key:', newAccount.privateKey);

//     // 获取有挖矿权限的账户列表
//     const minerAccounts = await getAccounts();

//     // 将新账户地址添加到挖矿权限账户列表中
//     minerAccounts.push(newAccount.address);

//     // 挖矿，将新账户余额设置为 10 ETH
//     const miner = minerAccounts[0]; // 选择第一个有挖矿权限的账户
//     const miningTransaction = await web3.eth.sendTransaction({
//       from: miner,
//       to: newAccount.address,
//       value: web3.utils.toWei('10', 'ether'),
//     });

//     console.log('Mining Transaction:', miningTransaction);

//     return newAccount;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// }
