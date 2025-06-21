const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3000;
const db_url = process.env.DB_URL;
const jwt_secret = process.env.JWT_SECRET;
const jwt_expired_in = process.env.JWT_EXPIRATION;
const cloudinary_name = process.env.CLOUDINARY_NAME;
const cloudinary_api_key = process.env.CLOUDINARY_API_KEY;
const cloudinary_api_secret = process.env.CLOUDINARY_API_SECRET;

module.exports = {
  db_url,
  port,
  jwt_secret,
  jwt_expired_in,
  cloudinary_name,
  cloudinary_api_key,
  cloudinary_api_secret,
};
