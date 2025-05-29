const { Client } = require("pg");
const { db_uri } = require("../constants");

const CREATE_AND_POPULATE_SQL = `
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,    
    email TEXT UNIQUE,
    password VARCHAR(255) NOT NULL,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) DEFAULT 'active',
    selected BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password, last_login, status, selected) VALUES
('Sanuar', 'Y7y5o@example.com', 'password', '2022-01-01 00:00:00', 'active', true),
('John Doe', 'i9dVb@example.com', 'password', '2022-02-01 00:00:00', 'inactive', false);
`;

async function populateDatabase() {
  const client = new Client({
    connectionString: db_uri,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try {
    await client.connect();

    // Check if users table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log("Users table not found. Creating and seeding database...");
      await client.query(CREATE_AND_POPULATE_SQL);
      console.log("Database seeding completed.");
    } else {
      console.log("Users table already exists. Skipping database seeding.");
    }
  } catch (error) {
    console.error("Error working with database:", error);
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = populateDatabase;
