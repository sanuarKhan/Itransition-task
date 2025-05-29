const { getUsers } = require("../db/queries");

const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json({ message: "All users", data: users });
  } catch (error) {
    console.error("Error in getAllUsers controller:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { getAllUsers };
