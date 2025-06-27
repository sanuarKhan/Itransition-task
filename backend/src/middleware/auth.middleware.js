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
    console.log(decodedToken.id, "from auth - token decoded successfully");

    // Add a small delay to see if this helps with timing issues
    await new Promise((resolve) => setTimeout(resolve, 10));

    console.log("About to query database for user:", decodedToken.id);

    const user = await db.user.findUnique({
      where: { id: decodedToken.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        lang: true,
        theme: true,
        img: true,
      },
    });

    console.log("Database query completed. User found:", !!user);

    if (!user) {
      console.log("User not found in database");
      return res.status(403).json({
        success: false,
        message: "user does not exist",
      });
    }

    if (user.isBlocked) {
      console.log("User is blocked");
      return res.status(403).json({
        success: false,
        message: "user is blocked",
      });
    }

    console.log("User authenticated successfully:", user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error occurred:", error.name, error.message);

    // Check if it's a process interruption
    if (error.code === "ECONNRESET" || error.message.includes("interrupted")) {
      console.error("Process was interrupted - likely server restart");
      return res.status(500).json({
        success: false,
        message: "Server restart interrupted request",
      });
    }

    // JWT specific errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    // Prisma/Database errors
    if (error.code?.startsWith("P")) {
      console.error("Database error:", error.code, error.message);
      return res.status(500).json({
        success: false,
        message: "Database error occurred",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid attempt to access this resource",
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
