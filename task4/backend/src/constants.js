const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const db_uri = process.env.DB_URI;

module.exports = { port, db_uri };
