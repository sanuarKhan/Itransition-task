// backend/src/middleware/auth.js
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const { decoded } = require("../utils/tokenGen");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decodedToken = decoded(token);
    console.log(decodedToken.userId);
    const user = await db.user.findUnique({
      where: { id: decodedToken.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isBlocked: true,
        language: true,
        theme: true,
        avatar: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: "Account is blocked" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const decodedToken = decoded(token);
      const user = await db.user.findUnique({
        where: { id: decodedToken.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isBlocked: true,
          language: true,
          theme: true,
          avatar: true,
        },
      });

      if (user && !user.isBlocked) {
        req.user = user;
      }
    } catch (error) {
      // Silent fail for optional auth
    }
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth,
};
