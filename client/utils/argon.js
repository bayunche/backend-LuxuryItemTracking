const argon2 = require("argon2");

export function argon(password) {
  // 哈希密码
  argon2.hash(password).then((hash) => {
    console.log("Hashed Password:", hash);
    return hash;
    // 在验证时使用 hash
  });
}

export function verifyArgon(hash) {
  argon2.verify(hash, "user_password").then((result) => {
    console.log("Password Match:", result);
    return result
  }).catch((err)=>{
    console.log(err)
  })
}
