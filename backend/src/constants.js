const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3000;
const db_url = process.env.DB_URL;
const jwt_secret = process.env.JWT_SECRET;
const jwt_expired_in = process.env.JWT_EXPIRATION;

module.exports = { db_url, port, jwt_secret, jwt_expired_in };
