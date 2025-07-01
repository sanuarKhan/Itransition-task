const express = require("express");

const {
  getAllUsersCTRL,
  searchUsersCTRL,
  getUserProfileCTRL,
  blockUnblockUserCTRL,
  updateUserRoleCTRL,
  deleteUserCTRL,
  getUserStatsCTRL,
  getDashboardStatsCTRL,
} = require("../controllers/user.controllers");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

// Get all users (admin only)
router.get("/", authenticateToken, requireAdmin, getAllUsersCTRL);

// Search users for autocomplete
router.get("/search", authenticateToken, searchUsersCTRL);

// Get user statistics (admin only)
router.get(
  "/stats/overview",
  authenticateToken,
  requireAdmin,
  getUserStatsCTRL
);

// Get dashboard data for regular users
router.get("/dashboard/stats", authenticateToken, getDashboardStatsCTRL);

// Get user profile
router.get("/:id", authenticateToken, getUserProfileCTRL);

// Block/unblock user (admin only)
router.put("/:id/block", authenticateToken, requireAdmin, blockUnblockUserCTRL);

// Promote/demote user to/from admin (admin only)
router.put("/:id/role", authenticateToken, requireAdmin, updateUserRoleCTRL);

// Delete user (admin only)
router.delete("/:id", authenticateToken, requireAdmin, deleteUserCTRL);

module.exports = router;
