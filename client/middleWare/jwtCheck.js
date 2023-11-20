

exports.jwtcheck = (req,res,next)=>{
    const {token}=req.headers
   let decodedToken= verifyToken(token)
    if (decodedToken==null) {
        res.send({ status: "refuse" })
        
    }else{
        req.userId=decodedToken.userId
        next()
    }
    
}