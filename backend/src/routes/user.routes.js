const { Router } = require("express");

const { getAllUsers, newUser } = require("../controllers/user.controllers");

const router = Router();

// GET /api/users - Get all users
router.get("/all", getAllUsers);

// POST /api/users - Create new user
router.post("/create", newUser);

module.exports = router;
