const { getUserByIdQuery } = require("../db/queries");
const { decoded } = require("../utilities/genToken");

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.headers["authorization"]?.split(" ")[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "access denied", success: false });
    }
    const user = decoded(token);

    const authUser = await getUserByIdQuery(user.id);

    if (!authUser) {
      return res
        .status(401)
        .json({ message: "user not found", redirectToLogin: true });
    }

    if (authUser.status === "blocked") {
      return res
        .status(401)
        .json({ message: "user is blocked", redirectToLogin: true });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Acess denied", success: false });
  }
};

module.exports = authMiddleware;
