const argon2 = require("argon2");

exports.argon = async (password) => {
  // 哈希密码
  console.log(password);
  return await argon2.hash(password);
};

exports.verifyArgon = async (hash, password) => {
  try {
    let result = await argon2.verify(hash, password);
    return result;
  } catch (error) {
    console.log(error);
  }
};
