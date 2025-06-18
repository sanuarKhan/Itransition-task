const { Router } = require("express");

const { register, login } = require("../controllers/user.controllers");

const router = Router();

// POST /api/users - Create new user
router.post("/register", register);
router.post("/login", login);

module.exports = router;
