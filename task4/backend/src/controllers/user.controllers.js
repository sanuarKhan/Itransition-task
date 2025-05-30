const {
  getUsersQuery,
  registerUserQuery,
  loginUserQuery,
  updateLastLoginTimeQuery,
  blockUserQuery,
  unblockUserQuery,
  deleteUserQuery,
} = require("../db/queries");

const getAllUsersCtrl = async (req, res) => {
  try {
    const users = await getUsersQuery();
    res.status(200).json({ message: "All users", data: users });
  } catch (error) {
    console.error("Error in getAllUsers controller:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const registerUserCtrl = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await registerUserQuery(name, email, password);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error in register user", error);
    res.status(500).json({
      success: false,
      message: "Error in register user",
      error: error,
    });
  }
};

const loginUserCtrl = async (req, res) => {
  const { email, password } = req.body;
  try {
    const loggedUser = await loginUserQuery(email, password);
    await updateLastLoginTimeQuery(loggedUser.email);
    res.status(200).json({
      success: true,
      message: "user logged successfully",
      data: loggedUser,
    });
  } catch (error) {
    console.error("Error in login user", error);
    res.status(500).json({
      success: false,
      message: "Error in login user",
      error: error,
    });
  }
};
const blockUserCtrl = async (req, res) => {
  const { id } = req.params;
  try {
    await blockUserQuery(id);
    res.status(200).json({
      success: true,
      message: "user blocked successfully",
    });
  } catch (error) {
    console.error("Error in blocking user", error);
    res.status(500).json({
      success: false,
      message: "Error in blocking user",
      error: error,
    });
  }
};
const unBlockUserCtrl = async (req, res) => {
  const { id } = req.params;
  try {
    await unblockUserQuery(id);
    res.status(200).json({
      success: true,
      message: "user unblocked successfully",
    });
  } catch (error) {
    console.error("Error in unblocking user", error);
    res.status(500).json({
      success: false,
      message: "Error in unblocking user",
      error: error,
    });
  }
};
const deleteUserCtrl = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUserQuery(id);
    res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleting user", error);
    res.status(500).json({
      success: false,
      message: "Error in deleting user",
      error: error,
    });
  }
};

module.exports = {
  getAllUsersCtrl,
  registerUserCtrl,
  loginUserCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
  deleteUserCtrl,
};
