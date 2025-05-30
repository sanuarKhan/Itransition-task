const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const db_uri = process.env.DB_URI;
const jwt_secret = process.env.JWT_SECRET;
const jwt_expired_in = process.env.JWT_EXPIRED_IN;

module.exports = { port, db_uri, jwt_secret, jwt_expired_in };
