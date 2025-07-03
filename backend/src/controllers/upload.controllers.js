const {
  cloudinary_name,
  cloudinary_api_key,
  cloudinary_api_secret,
} = require("../constants");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: cloudinary_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
});

const uploadImageCTRL = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "doolge-torm/templates",
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
};

const uploadAvatarCTRL = async (req, res) => {
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
            folder: "doogle-torm/avatars",
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
};

const deleteImageCTRL = async (req, res) => {
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
};

module.exports = {
  uploadImageCTRL,
  uploadAvatarCTRL,
  deleteImageCTRL,
};
