const { Pool } = require("pg");
const { db_uri } = require("../constants");

module.exports = new Pool({
  connectionString: db_uri,
  ssl: {
    rejectUnauthorized: false,
  },
});
