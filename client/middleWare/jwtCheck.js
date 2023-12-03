const { verifyToken } = require("../utils/jwtCheck");
exports.jwtcheck =async (req, res, next) => {
  const token = req.headers.authorization;
  if (token == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let jwtToken = token.replace("Bearer ", "");
  let decodedToken =await verifyToken(jwtToken);
  if (decodedToken == null) {
    return res.status(401).json({ message: 'Unauthorized' });
  } else {
    req.userId = decodedToken.userId;
    next();
  }
};
