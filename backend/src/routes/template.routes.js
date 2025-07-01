const express = require("express");
const {
  authenticateToken,
  optionalAuth,
  requireAdmin,
} = require("../middleware/auth.middleware");
const {
  getPublicTemplates,
  getMyTemplates,
  createTemplate,
  getSingletemplate,
  updatedTemplate,
  updateTemplateQuestions,
  deleteTemplate,
  getTemplateResults,
  getTemplateAnalytics,
  toggleTemplateLike,
  addTemplateComment,
  getTemplateComments,
} = require("../controllers/template.controllers");

const router = express.Router();

router.get("/", optionalAuth, getPublicTemplates);
router.get("/my", authenticateToken, getMyTemplates);
router.get("/:id", optionalAuth, getSingletemplate);
router.post("/create", authenticateToken, createTemplate);
router.put("/:id", authenticateToken, updatedTemplate);
router.put("/:id/questions", authenticateToken, updateTemplateQuestions);
router.delete("/:id", authenticateToken, deleteTemplate);
router.get("/:id/results", authenticateToken, getTemplateResults);
router.get("/:id/analytics", authenticateToken, getTemplateAnalytics);
router.post("/:id/like", authenticateToken, toggleTemplateLike);
router.post("/:id/comments", authenticateToken, addTemplateComment);
router.get("/:id/comments", getTemplateComments);

module.exports = router;
