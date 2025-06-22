const { decoded } = require("../utils/tokenGen");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "you are not authorized to access this resource",
      });
    }

    const decodedToken = decoded(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid  attempt to access this resource",
    });
  }
};
module.exports = auth;
