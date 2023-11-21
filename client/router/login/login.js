const { now } = require("moment/moment");
const { connectDatabase, getAllUsers } = require("../../data/UserDatabase");
const User = require("../../data/entity/user");
const { ulid } = require("ulid");

const login = require("../../tools/data/models/login");
const { genrateToken } = require("../../utils/jwtCheck");
const { argon, verify } = require("../../utils/argon");

export function login(req, res) {
  let { userName, password } = req.body;
  let passwordF = argon(password);
  let condition = 1;
  // user.find({ userName, passWordM: passwordF, condition }).then((result) => {
  //     res.send({ status: "ok", token: token, result })
  // }).catch((err)=>{
  //     res.send({ status: "refuse" })
  // })
  const userRepository = connectDatabase().getRepository(User);
  const user = userRepository;

  let result = user.find(userName, passwordF).then((res) => {
    if (res != null) {
      user.update(userName, { loginTime: now() });
      return res;
    }
  });
  user.close();
  res.setHeader({
    token: genrateToken(result),
  });
  res.send({
    msg: null,
    data: null,
    status: "ok",
  });
  return;
}
export function signin(req, res) {
  let { userName, password } = req.body;
  let passwordF = argon(password);
  const userRepository = connection.getRepository(User);
  const user = new User();
  let userId = ulid();
  user = { userName, passwordF, userId, permissions: 0, loginTime: now() };
  userRepository
    .save(User)
    .then((res) => {
      res.setHeader;
      res.send({ status: "ok", msg: null, data: null });
    })
    .catch((err) => {
      console.error(err);
    });
}
