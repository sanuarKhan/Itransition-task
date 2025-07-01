const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { authenticateToken } = require("../middleware/auth.middleware");
const {
  uploadImageCTRL,
  uploadAvatarCTRL,
  deleteImageCTRL,
} = require("../controllers/upload.controllers");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Routes
router.post(
  "/image",
  authenticateToken,
  upload.single("image"),
  uploadImageCTRL
);
router.post(
  "/avatar",
  authenticateToken,
  upload.single("avatar"),
  uploadAvatarCTRL
);
router.delete("/image/:publicId", authenticateToken, deleteImageCTRL);

// Error handling for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File size too large. Maximum 10MB allowed." });
    }
  }

  if (error.message === "Only image files are allowed") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
});

module.exports = router;
