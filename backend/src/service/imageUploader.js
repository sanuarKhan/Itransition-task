const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const {
  cloudinary_name,
  cloudinary_api_key,
  cloudinary_api_secret,
} = require("../constants");

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudinary_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
});

// Create a Cloudinary storage instance
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "doogle-torm", // Specify the folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif"], // Allowed file formats
  },
});

// Create a multer instance with the Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;
