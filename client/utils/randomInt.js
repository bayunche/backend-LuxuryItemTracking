const crypto = require("crypto");

// 生成安全的随机数
 function generateSecureRandomNumber() {
  // 获取当前时间戳
  const timestamp = Date.now();
  // 生成一个随机数
  const random = Math.floor(Math.random() * 1000000);
  // 使用时间戳和随机数创建一个字符串
  const serialStr = `${timestamp}${random}`;
  // 将字符串转换为BigInt
  const serialNumber = BigInt(serialStr);
  return serialNumber;
}

module.exports = generateSecureRandomNumber;
