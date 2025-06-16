const db = require("../db/db");
// console.log(db);

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await db.user.findMany();
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
const newUser = async (req, res) => {
  try {
    const { email, name } = req.body;
    const newUser = await db.user.create({
      data: {
        email,
        name,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: "Failed to create user" });
  }
};

module.exports = { newUser, getAllUsers };
