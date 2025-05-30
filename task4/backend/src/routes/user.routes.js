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

router.get("/all", getAllUsersCtrl);
router.post("/register", registerUserCtrl);
router.post("/login", loginUserCtrl);
router.put("/block/:id", blockUserCtrl);
router.put("/unblock/:id", unBlockUserCtrl);
router.delete("/delete/:id", deleteUserCtrl);

module.exports = router;
