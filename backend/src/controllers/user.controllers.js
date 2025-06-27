const db = require("../db/db");
const bcrypt = require("bcryptjs");
const { genJWTToken } = require("../utils/tokenGen");

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
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
    const { email, password } = req.body;

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "User is blocked",
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
