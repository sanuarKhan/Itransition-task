const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const { createTemplate } = require("../controllers/template.controllers");

const router = Router();

router.post("/create", auth, createTemplate);

module.exports = router;
