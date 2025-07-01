const express = require("express");

const {
  searchTemplatesCTRL,
  getTagsCTRL,
  getTagCloudCTRL,
  getSuggestionsCTRL,
} = require("../controllers/search.controllers");
const { optionalAuth } = require("../middleware/auth.middleware");

const router = express.Router();

// Full-text search for templates
router.get("/templates", optionalAuth, searchTemplatesCTRL);

// Get all tags for autocomplete
router.get("/tags", getTagsCTRL);

// Get tag cloud
router.get("/tag-cloud", getTagCloudCTRL);

// Get search suggestions
router.get("/suggestions", getSuggestionsCTRL);

module.exports = router;
