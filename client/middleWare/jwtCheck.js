const { verifyToken } = require("../utils/jwtCheck");
// const { verifyToken } = require('./your-token-module');

exports.jwtcheck = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const jwtToken = token.replace("Bearer ", "");
    const decodedToken = await verifyToken(jwtToken);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    console.error("Error in jwtcheck middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
