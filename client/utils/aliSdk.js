const { urlencoded } = require("body-parser");

const AliSdk = require("alipay-sdk").default;

const alipay = new AliSdk({
  appId: "9021000135698648",
  privateKey:
    "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFLxLxBgLN6GVfDnE2ARf3NaHrPfBaD0RB42qGlktlmH4HrnxcyUMtV1UVst+FTeArSv3ISYOLLWYkn9Y1hXfjfNPw3cqSHyUZUgqf4Ry64fXoembziYWlZ4rr+9o6u79U1wRBxxW0MbJ29gg5XZOJckqUpGCwXwxPBfTcdoc59Hg5SZkG0iVcZ3rhWhuAvPm332EPOngGIK4U3ht1LScbtFks0r3T65BK/xCKM8YYna9lTB2rCgPVssjDAnwSNVs8ei3+n4PFsHs67sSJXfFcy+ZsYk5oPDVJCcW735GlZ5zhVIVOl4+u5BykvJsdVE/PtG2Krt3ywHurz/0bG/qLAgMBAAECggEBALr6bWqx+XzJbz7ZEg9UsCYR7G2GeWDc8yvLe1sOL4ayOGgOVA0kKBhZpOwDhyL/+p7y6H3BAAS80wvNqTFtU4ca+lp/5jPzZpmBC2QZ8cVguW9uiitLb7it27T0SDbDi6XmkjnRj8okCgf2O0wyaNG/1+rliG4WYzSYAF4B4y7W7mb70LE5TvN7bc5lrhaOW+343lp1+1/9XJSmGS6vF3CDFs6AmBvnWU3ucuU2lG3u+RLbSXfYR78Rqi/GzE9T9gVjYoMLdK0Nxnz1Gcb2dy4A6uWFU9AjhoP9HvvjzNg0AGwYxJJmB10dWdbAp4uYLdIbNr8pem6aMyf5GJ65/HECgYEA/+e7OZSp2SsaBB+I6F03NfVpY8QINsPHxXExqKEHzZl4GIZT44MrzO0eqHsTYASZYkx1hLH5yoU8lI+igFFOZKkOcA+hA6JU1MTJ4VvDKeLhMynSbFY5GVgVXaVRJslmYQBoNaWdHq1Hbln0DjdnuJq5DMO1cteYRQdMeb74oGMCgYEAxUHGGfSkujoIvi8eiho3B1QoFxvQSLDQbTbCEFBuXp1Cs8O3hVWVVzorsG8m4leC8I4xvwLJQ8roviMMwTZVMEh3fJs8C6XOHR0WqPy9QxjyHZWARwXElQymovd0rBo3c2p6LSa0NwRWDMDs+ypIWTmume6uJGVypMtsrUaIkbkCgYEAqkAwZkmKimnLgCy+t+C0R5jDCdW0pUKxWKFLKWYgu987cA2GKBnvfQHQYMSpCjtlFGnL0YFaryrfN/MraHUvU3bJnTI4rCNGjttxeBXFjMtdid1sGhlvGXZpmIjQqZ5aF3Te37oUAwHDQR5laUPhJIcDUAOwZvwaWOpXLbQo0wMCgYA62H9fuOL3h16aVfY3XtCxyAJZunttZAoZuq80LLpwUVvXwvhZt4lgx0LHVLF17oNqfhELGaqvJbY/GrewYCQTzlqO+sRz+Re/CbF74kIX5TY9ax8kkOzvRiHkFgxhV0TZkpc2Jwi2LP36ugc4eomwzItw8opS40zLKsCWBKezSQKBgALO3luzUkMbgllC9aZJL0Y0PCyaBJG4yOpv8Kg2+QG/w2eMQz8OXdymYPss4v/xCyMohFn8PwwtVoPKEcl1RARMYMN3PhDVHYj7eqU505DtMLgn+bvDVpI3gL1bZaJJWXk4mvAQg2zGTeN1zD83cjKvq0hKWrMZApHagg4Afxra",
  alipayPublicKey:
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxS8S8QYCzehlXw5xNgEX9zWh6z3wWg9EQeNqhpZLZZh+B658XMlDLVdVFbLfhU3gK0r9yEmDiy1mJJ/WNYV343zT8N3Kkh8lGVIKn+EcuuH16Hpm84mFpWeK6/vaOru/VNcEQccVtDGydvYIOV2TiXJKlKRgsF8MTwX03HaHOfR4OUmZBtIlXGd64VobgLz5t99hDzp4BiCuFN4bdS0nG7RZLNK90+uQSv8QijPGGJ2vZUwdqwoD1bLIwwJ8EjVbPHot/p+DxbB7Ou7EiV3xXMvmbGJOaDw1SQnFu9+RpWec4VSFTpePruQcpLybHVRPz7Rtiq7d8sB7q8/9Gxv6iwIDAQAB",
  gateway: "https://openapi-sandbox.dl.alipaydev.com/gateway.do",
});

const order_on = () => {
  //创建一个64字符的字符串，仅有字母、数字、下划线,保证在商户端不重复
  let nonce_str = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
  for (let i = 0; i < 64; i++) {
    nonce_str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce_str;
};

const getOrderStr = async (total_amount, userId) => {
    const encodedUserId=encodeURI(userId)
  const result = await alipay.sdkExec("alipay.trade.app.pay", {
    bizContent: {
      extend_params: {
        specified_seller_name: "区块链充值系统",
      },
      out_trade_no: order_on,

      passback_params:encodedUserId,
      total_amount: total_amount,
      subject: "区块链余额充值",
    },
  });
  return result;
};
export default getOrderStr;