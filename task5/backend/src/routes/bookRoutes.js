const express = require("express");
const router = express.Router();

const { getBooks } = require("../controllers/bookControllers"); // Changed from bookController to bookControllers

router.get("/", getBooks);

module.exports = router;
