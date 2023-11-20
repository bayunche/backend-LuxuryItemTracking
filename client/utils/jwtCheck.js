const jwt =require("jsonwebtoken")
const { ulid } = require('ulid');

const secertKey='Hatsune Miku'

const genrateToken=(userId)=>{
   
    return jwt.sign({
        userId:ulid(),
        // userId:'userId'
    },secertKey,{
        expiresIn:'1h'
    })
}

const verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (err) {
      console.error('JWT Verification Failed:', err);
      return null;
    }
  };
  module.exports= {genrateToken,verifyToken}