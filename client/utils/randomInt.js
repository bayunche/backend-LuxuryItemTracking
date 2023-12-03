const crypto = require("crypto");

// 生成安全的随机数
function generateSecureRandomNumber() {
  const byteLength = 4; // 4 bytes = 32 bits (adjust as needed)
  const randomBuffer = crypto.randomBytes(byteLength);

  // 将随机字节转换为一个无符号整数
  const secureRandomNumber = randomBuffer.readUInt32LE();

  return secureRandomNumber;
}


module.exports= generateSecureRandomNumber;