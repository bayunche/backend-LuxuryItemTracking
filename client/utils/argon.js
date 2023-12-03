const argon2 = require("argon2");

exports.argon= async(password)=> {
  // 哈希密码
  console.log(password)
  return await argon2.hash(password)
}

exports.verifyArgon= async(hash)=>{
  argon2.verify(hash, "user_password").then((result) => {
    console.log("Password Match:", result);
    return result
  }).catch((err)=>{
    console.log(err)
  })
}
