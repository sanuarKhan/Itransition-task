//src/controllers/auth.controllers.js
const db = require("../db/db");
const { genJWTToken } = require("../utils/tokenGen");
const bcrypt = require("bcryptjs");
const registerCTRL = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ error: "Password must be at least 5 characters" });
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        lang: true,
        theme: true,
        img: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = genJWTToken(user.id);

    res.status(201).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginCTRL = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: "Account is blocked" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = genJWTToken(user.id);

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      lang: user.lang,
      theme: user.theme,
      img: user.avatar,
      createdAt: user.createdAt,
    };

    res.json({
      message: "Login successful",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const currentUserCTRL = async (req, res) => {
  res.json({ user: req.user });
};

const profileCTRL = async (req, res) => {
  try {
    const { name, lang, theme } = req.body;

    const updatedUser = await db.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(lang && { lang }),
        ...(theme && { theme }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        lang: true,
        theme: true,
        img: true,
        createdAt: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const avatarCTRL = async (req, res) => {
  try {
    const { avatar } = req.body;

    const updatedUser = await db.user.update({
      where: { id: req.user.id },
      data: { avatar },
      select: {
        //TODO: need to study
        id: true,
        email: true,
        name: true,
        role: true,
        lang: true,
        theme: true,
        img: true,
        createdAt: true,
      },
    });

    res.json({
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Avatar update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerCTRL,
  loginCTRL,
  currentUserCTRL,
  profileCTRL,
  avatarCTRL,
};
