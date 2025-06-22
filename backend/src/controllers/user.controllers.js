const db = require("../db/db");
const bcrypt = require("bcryptjs");
const { genJWTToken } = require("../utils/tokenGen");

const register = async (req, res) => {
  try {
    const { email, name, pass } = req.body;

    const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = await db.user.create({
      data: {
        email,
        name,
        pass: hashedPassword,
      },
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({
      success: false,
      message: "Error creating user",
    });
  }
};

//login controller
const login = async (req, res) => {
  try {
    const { email, pass } = req.body;

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const validPass = await bcrypt.compare(pass, user.pass);

    if (!validPass) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    user.pass = undefined;
    // Generate JWT token
    const token = genJWTToken(user);
    res.cookie("token", token);
    res.status(201).json({
      success: true,
      message: "User logged successfully",
      data: user,
      token,
    });
  } catch (error) {
    console.error("Error logging user:", error);
    res.status(400).json({
      success: false,
      message: "Error logging user",
    });
  }
};

module.exports = { register, login };
