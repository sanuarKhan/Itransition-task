const { Router } = require("express");

const { register, login } = require("../controllers/user.controllers");

const router = Router();

// POST /api/users - Create new user
// Register
// router.post("/register", async (req, res) => {
//   try {
//     const { email, password, name } = req.body;

//     // Validation
//     if (!email || !password || !name) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     if (password.length < 5) {
//       return res
//         .status(400)
//         .json({ error: "Password must be at least 5 characters" });
//     }

//     // Check if user exists
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create user
//     const user = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         name,
//       },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         role: true,
//         language: true,
//         theme: true,
//         avatar: true,
//         createdAt: true,
//       },
//     });

//     // Generate token
//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.status(201).json({
//       message: "User created successfully",
//       user,
//       token,
//     });
//   } catch (error) {
//     console.error("Register error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password are required" });
//     }

//     // Find user
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     if (user.isBlocked) {
//       return res.status(403).json({ error: "Account is blocked" });
//     }

//     // Check password
//     const isValidPassword = await bcrypt.compare(password, user.password);

//     if (!isValidPassword) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // Generate token
//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     const userResponse = {
//       id: user.id,
//       email: user.email,
//       name: user.name,
//       role: user.role,
//       language: user.language,
//       theme: user.theme,
//       avatar: user.avatar,
//       createdAt: user.createdAt,
//     };

//     res.json({
//       message: "Login successful",
//       user: userResponse,
//       token,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

// Update profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, language, theme } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(language && { language }),
        ...(theme && { theme }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        language: true,
        theme: true,
        avatar: true,
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
});

// Update avatar
router.put("/avatar", authenticateToken, async (req, res) => {
  try {
    const { avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar },
      select: {
        //TODO: need to study
        id: true,
        email: true,
        name: true,
        role: true,
        language: true,
        theme: true,
        avatar: true,
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
});

module.exports = router;
