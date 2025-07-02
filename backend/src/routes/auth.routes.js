// backend/src/routes/auth.routes.js
const express = require("express");

const {
  registerCTRL,
  loginCTRL,
  currentUserCTRL,
  profileCTRL,
  avatarCTRL,
} = require("../controllers/auth.controllers");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();
router.post("/register", registerCTRL);
router.post("/login", loginCTRL);
router.get("/me", authenticateToken, currentUserCTRL);
router.put("/profile", authenticateToken, profileCTRL);
router.put("/avatar", authenticateToken, avatarCTRL);

module.exports = router;
