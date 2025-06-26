const { decoded } = require("../utils/tokenGen");
const db = require("../db/db");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "you are not authorized to access this resource",
    });
  }
  try {
    const decodedToken = decoded(token);
    const user = await db.prisma.user.findUnique({
      where: { id: decodedToken.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        blocked: true,
        langguage: true,
        theme: true,
        img: true,
      },
    });
    if (!user || user.blocked) {
      return res.status(403).json({
        success: false,
        message: "user is blocked or does not exist",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid  attempt to access this resource",
    });
  }
};

const authAdmin = async (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "you are not authorized to access this resource",
    });
  }
  next();
};

module.exports = {
  auth,
  authAdmin,
};
