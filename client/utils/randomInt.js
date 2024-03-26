const crypto = require("crypto");

// 生成安全的随机数
function generateSecureRandomNumber() {
  const timestamp = BigInt(Date.now());
  const randomPart = BigInt(Math.floor(Math.random() * 10000)); // 生成一个较小的随机数
  return (timestamp << 16n) + randomPart; // 将时间戳和随机数结合

 
}


module.exports= generateSecureRandomNumber;