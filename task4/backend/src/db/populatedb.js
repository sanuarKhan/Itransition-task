const { Client } = require("pg");
const { db_uri } = require("../constants");

const SQL = `
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,    
    email TEXT UNIQUE,
    password VARCHAR(255) NOT NULL,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) DEFAULT 'active',
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
    console.log("seeding database...");
    await client.query(SQL);
    console.log("Database seeding completed.");
  } catch (error) {
    console.error("Error working with database:", error);
    throw error;
  } finally {
    await client.end();
  }
}
populateDatabase();
module.exports = populateDatabase;
