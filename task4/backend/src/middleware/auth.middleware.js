const { decoded } = require("../utilities/genToken");

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.headers["authorization"]?.split(" ")[1] || req.cookies.token;
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "access denied", success: false });
    }
    const user = decoded(token);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unauthorized", success: false });
  }
};

module.exports = authMiddleware;
