const express = require("express");
const router = express.Router();

const {
  getAllUsersCtrl,
  registerUserCtrl,
  loginUserCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
  deleteUserCtrl,
} = require("./../controllers/user.controllers");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/all", getAllUsersCtrl);
router.post("/register", registerUserCtrl);
router.post("/login", loginUserCtrl);
router.put("/block/:id", authMiddleware, blockUserCtrl);
router.put("/unblock/:id", authMiddleware, unBlockUserCtrl);
router.delete("/delete/:id", authMiddleware, deleteUserCtrl);

module.exports = router;
