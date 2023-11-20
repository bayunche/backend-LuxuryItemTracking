const login = require("../../tools/data/models/login")
const {genrateToken} = require("../../utils/jwtCheck")
const {argon,verify}=require("../../utils/argon")

export function login (req, res) {
    let { userName, password } = req.body
    let passwordF = argon(password)
    let condition = 1
    // user.find({ userName, passWordM: passwordF, condition }).then((result) => {
    //     res.send({ status: "ok", token: token, result })
    // }).catch((err)=>{
    //     res.send({ status: "refuse" })
    // })
   
 
    // user.find({ userName }, { UID: 1 }).then((result) => {
    //     login.create({ "UID": result[0].UID, "logintime": addlikeTime }, (err, result) => {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //         }
    //     })
    // })

    // return;


}

