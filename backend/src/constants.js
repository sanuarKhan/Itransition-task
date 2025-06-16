const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3000;
const db_url = process.env.DB_URL;

module.exports = { db_url, port };
