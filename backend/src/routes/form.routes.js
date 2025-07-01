const express = require("express");
const {
  getMyFormsCTRL,
  getFormByIdCTRL,
  checkFormExistsCTRL,
  submitFormCTRL,
  updateFormCTRL,
  deleteFormCTRL,
  getFormStatsCTRL,
} = require("../controllers/form.controllers");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// Get user's forms
router.get("/my", authenticateToken, getMyFormsCTRL);

// Get specific form
router.get("/:id", authenticateToken, getFormByIdCTRL);

// Check if user has filled template
router.get("/check/:templateId", authenticateToken, checkFormExistsCTRL);

// Submit form
router.post("/submit/:templateId", authenticateToken, submitFormCTRL);

// Update form (edit answers)
router.put("/:id", authenticateToken, updateFormCTRL);

// Delete form
router.delete("/:id", authenticateToken, deleteFormCTRL);

// Get form statistics for dashboard
router.get("/stats/overview", authenticateToken, getFormStatsCTRL);

module.exports = router;
