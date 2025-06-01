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

router.post("/register", registerUserCtrl);
router.post("/login", loginUserCtrl);
router.get("/all", authMiddleware, getAllUsersCtrl);
router.put("/block", authMiddleware, blockUserCtrl);
router.put("/unblock", authMiddleware, unBlockUserCtrl);
router.delete("/delete/:id", authMiddleware, deleteUserCtrl);

module.exports = router;
