const { default: AliPayForm } = require("alipay-sdk/lib/form");
const { urlencoded } = require("body-parser");

const AliSdk = require("alipay-sdk").default;
const AlipayFormData = require("alipay-sdk/lib/form").default;
const alipay = new AliSdk({
  appId: "9021000135698648",
// 生产环境
  // privateKey:
  //   "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFLxLxBgLN6GVfDnE2ARf3NaHrPfBaD0RB42qGlktlmH4HrnxcyUMtV1UVst+FTeArSv3ISYOLLWYkn9Y1hXfjfNPw3cqSHyUZUgqf4Ry64fXoembziYWlZ4rr+9o6u79U1wRBxxW0MbJ29gg5XZOJckqUpGCwXwxPBfTcdoc59Hg5SZkG0iVcZ3rhWhuAvPm332EPOngGIK4U3ht1LScbtFks0r3T65BK/xCKM8YYna9lTB2rCgPVssjDAnwSNVs8ei3+n4PFsHs67sSJXfFcy+ZsYk5oPDVJCcW735GlZ5zhVIVOl4+u5BykvJsdVE/PtG2Krt3ywHurz/0bG/qLAgMBAAECggEBALr6bWqx+XzJbz7ZEg9UsCYR7G2GeWDc8yvLe1sOL4ayOGgOVA0kKBhZpOwDhyL/+p7y6H3BAAS80wvNqTFtU4ca+lp/5jPzZpmBC2QZ8cVguW9uiitLb7it27T0SDbDi6XmkjnRj8okCgf2O0wyaNG/1+rliG4WYzSYAF4B4y7W7mb70LE5TvN7bc5lrhaOW+343lp1+1/9XJSmGS6vF3CDFs6AmBvnWU3ucuU2lG3u+RLbSXfYR78Rqi/GzE9T9gVjYoMLdK0Nxnz1Gcb2dy4A6uWFU9AjhoP9HvvjzNg0AGwYxJJmB10dWdbAp4uYLdIbNr8pem6aMyf5GJ65/HECgYEA/+e7OZSp2SsaBB+I6F03NfVpY8QINsPHxXExqKEHzZl4GIZT44MrzO0eqHsTYASZYkx1hLH5yoU8lI+igFFOZKkOcA+hA6JU1MTJ4VvDKeLhMynSbFY5GVgVXaVRJslmYQBoNaWdHq1Hbln0DjdnuJq5DMO1cteYRQdMeb74oGMCgYEAxUHGGfSkujoIvi8eiho3B1QoFxvQSLDQbTbCEFBuXp1Cs8O3hVWVVzorsG8m4leC8I4xvwLJQ8roviMMwTZVMEh3fJs8C6XOHR0WqPy9QxjyHZWARwXElQymovd0rBo3c2p6LSa0NwRWDMDs+ypIWTmume6uJGVypMtsrUaIkbkCgYEAqkAwZkmKimnLgCy+t+C0R5jDCdW0pUKxWKFLKWYgu987cA2GKBnvfQHQYMSpCjtlFGnL0YFaryrfN/MraHUvU3bJnTI4rCNGjttxeBXFjMtdid1sGhlvGXZpmIjQqZ5aF3Te37oUAwHDQR5laUPhJIcDUAOwZvwaWOpXLbQo0wMCgYA62H9fuOL3h16aVfY3XtCxyAJZunttZAoZuq80LLpwUVvXwvhZt4lgx0LHVLF17oNqfhELGaqvJbY/GrewYCQTzlqO+sRz+Re/CbF74kIX5TY9ax8kkOzvRiHkFgxhV0TZkpc2Jwi2LP36ugc4eomwzItw8opS40zLKsCWBKezSQKBgALO3luzUkMbgllC9aZJL0Y0PCyaBJG4yOpv8Kg2+QG/w2eMQz8OXdymYPss4v/xCyMohFn8PwwtVoPKEcl1RARMYMN3PhDVHYj7eqU505DtMLgn+bvDVpI3gL1bZaJJWXk4mvAQg2zGTeN1zD83cjKvq0hKWrMZApHagg4Afxra",
  // alipayPublicKey:
  //   "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxS8S8QYCzehlXw5xNgEX9zWh6z3wWg9EQeNqhpZLZZh+B658XMlDLVdVFbLfhU3gK0r9yEmDiy1mJJ/WNYV343zT8N3Kkh8lGVIKn+EcuuH16Hpm84mFpWeK6/vaOru/VNcEQccVtDGydvYIOV2TiXJKlKRgsF8MTwX03HaHOfR4OUmZBtIlXGd64VobgLz5t99hDzp4BiCuFN4bdS0nG7RZLNK90+uQSv8QijPGGJ2vZUwdqwoD1bLIwwJ8EjVbPHot/p+DxbB7Ou7EiV3xXMvmbGJOaDw1SQnFu9+RpWec4VSFTpePruQcpLybHVRPz7Rtiq7d8sB7q8/9Gxv6iwIDAQAB",
  // gateway: "https://openapi-sandbox.dl.alipaydev.com/gateway.do",
  // 沙箱环境
  privateKey:'MIIEowIBAAKCAQEAyve5BMH2Tzxx5bERUZnQgzO812CPenTjFKXNUk6zvVCoGE8cQFh6456HfiUng2BYGmWQJTnQlGefY0XCd3YQmQ/C0MY8iYPtcKpf90TzltwAqsWC/RaGs+TSQkZvRcb9WktsBz7tIyUBt2DSR6HEC/3NseyAXlazkfB+LKP83rq6PxNNksJqnDzwlyekDDjXgAjlFlJRQr3KCoVh+lO/v31M9hMjZg59c2m8QjXg5xCiH5qsvfzyW4E6oPoxY79HMPZK3NSbcQNWybsdB4N7MKQ2XEOsPB/K4aqL2b6Y89F6YAtYXrb8wt7y1tPRGgctAT8S76YmD9ZNuLorLkBikwIDAQABAoIBADiAZZ0RccP1C6/pbuzMaONdT8CVPNvWFjD1RwcWqaqV/XVm8HJpLyyWQRm4ths4gs42X749LfdiMVitXslqsIwrewwrY0bU1xB6HWT0aOsiK31epmxWDQGfPXj9qpQ+JOEyBcyuk80ozCWEaoVOXwkHim9xavrYH/0MedNrg0VtLueKobbz2rGgn+r//ssjjg8MjZyDNIdPwyGGz1w4bLbGKtvrcP2fGrUn8T2vZ6XNbLELuGFNrCbuaN8Ltfi1L9VWEno/Rfs8UvSo2qv2vDX/roZP84Q9vFCRNw+XxNZpMOy8Pk+7Gl0bu8znEAOY7bnUzuzeL0PMRGse+YrxUcECgYEA5ug2NG+DX/f5JSzN4+OPE9uawgNYDZWtTvy4HY1CRCmoeWkq4/zl9in0FVBqtnjiMIE/UYAhA7l7JUGukHooaKujLyMsNm7ySsoHTsyta4SvDAjP1bF99ZtNd8CD9MnPbZiM1vpWZrMBssrxBdYDOjFTEfZ687sChlvN68eGXssCgYEA4QY+A4GTUqIV3DP2tzDEzRdmYc9xsLKPk5BUEwwGow32CAA30xGY5GZUDc3rMjca0fStDw+/yqV3vtvHfScscV9a+AX3pOcXwGFsiEhmQG/KOFR783HctCCDBrqOtwx0yPMW2a6PB+L9D+EwPOM8yaGxZUAntv1/o8lQigZQilkCgYEA174lTy7Vz+gQKFTJdmCawVIRMa8QKXks+b0UhcADJ07I8894XJZhgnPGc9e0LRObOvi34X1W23UFA1VwNdt9P/cGPDefyqg0x/4lf9GrQucw6oydK6tv5fgaFIaShDe/EEZVaVNzQPeF4bjOI8bHMyr80665SFr1y/Wg2+iLuqsCgYBQHIzPar4sWRA3STi4l2A5M+97OwNayPdcrbGA5nMmcb35szospsMr7VJXZ8woIH4n6VgDWLQLTUWIaW5oHB4ybqRQUK+Nwcgu8YBWNJBSuHnh/BH05cCRUFHVf213tbOOJx0neoHpaOJ3WNB3nN7zWeFyDpkVCML8aJuHyB+8YQKBgArYJWrjwA4tYKYeFnc5/thcuILPZva9iUwXm6V4X4r8s6Ws8KC98nex8tfay2DKdQm4WxSCpCSOMZA/9sQ60s1f6DzfHY9FdrulnGb7TaX/Bp3YAp17nZ48Cc5wNOsA5m2gnZ01RuVuqEB/nbxRNIrMJU8y8bqZ/weBZT8rqL3r'
  ,
  alipayPublicKey:"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjH1Ga7EbKpsv+GcnfpNVs6iEU462k9W3KASzg4eN/lCi7gmwI3/U7XTqpXMxblu73rsQytPv+VPrxbzgJl7mml9K0GDQdJCcVi3GCiiOuPeFTPDKnH7rz769UjxL3zOxAbkiUUgB0wixxg5M6JNTSzgCxZLR6ZCgkkmr7IXu03DlylSJjLl7bfmm+16AsLGs+tPNKnox7WgBiCI4PKw+794EczllW4zyJqoA8Hw3ros1yvvqVkAfQGjqflbJXWT5Jc/msBUmhLvLQV4wvUPj/GtUWzyqdZ3P87asmep+66tlqsCYJehjgP274SvMfeJDpIVpYamr1UmmUyU/H0kpXQIDAQAB",
  gateway:"https://openapi-sandbox.dl.alipaydev.com/gateway.do",
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

exports.getOrderStr = async (total_amount, userId) => {
  const formData = new AlipayFormData();
  formData.setMethod("get");

  const encodedUserId = encodeURI(userId);
  formData.addField("bizContent", {
    out_trade_no: order_on,
    total_amount: total_amount,
    subject: "区块链余额充值",
    quit_url: "",
    notify_url: "",
    passback_params: encodedUserId,
  });
  const result = await alipay.exec(
    "alipay.trade.wap.pay",
    {},
    {
      formData: formData,
    },
    { validateSign: true }
  );
  return result

  // const result = await alipay.sdkExec("alipay.trade.wap.pay", {
  //   bizContent: {
  //     extend_params: {
  //       specified_seller_name: "区块链充值系统",
  //     },
  //     out_trade_no: order_on,
  //     quit_url:"",
  //     passback_params: encodedUserId,
  //     total_amount: total_amount,
  //     subject: "区块链余额充值",
  //   },
  // });

  return result;
};
