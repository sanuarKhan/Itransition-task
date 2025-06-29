const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { authenticateToken } = require("../middleware/auth.middleware");

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

// Upload image
router.post(
  "/image",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "formcraft/templates",
              transformation: [
                { width: 800, height: 600, crop: "limit" },
                { quality: "auto:good" },
                { format: "auto" },
              ],
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(req.file.buffer);
      });

      res.json({
        message: "Image uploaded successfully",
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Upload image error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

// Upload avatar
router.post(
  "/avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No avatar file provided" });
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "formcraft/avatars",
              transformation: [
                { width: 200, height: 200, crop: "fill", gravity: "face" },
                { radius: "max" },
                { quality: "auto:good" },
                { format: "auto" },
              ],
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(req.file.buffer);
      });

      res.json({
        message: "Avatar uploaded successfully",
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Upload avatar error:", error);
      res.status(500).json({ error: "Failed to upload avatar" });
    }
  }
);

// Delete image from Cloudinary
router.delete("/image/:publicId", authenticateToken, async (req, res) => {
  try {
    const publicId = req.params.publicId.replace(/-/g, "/"); // Convert back to original format

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(400).json({ error: "Failed to delete image" });
    }
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
});

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
