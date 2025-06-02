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

CREATE UNIQUE INDEX idx_users_email ON users(email);

INSERT INTO users (name, email, password, last_login, status) VALUES 
('Sanuar', 'Y7y5o@example.com', 'password', '2022-01-01 00:00:00', 'active'),
('John Doe', 'i9dVb@example.com', 'password', '2022-02-01 00:00:00', 'inactive');
`;

async function populateDatabase() {
  console.log("seeding database...");
  const client = new Client({
    connectionString: db_uri,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Database seeding completed.");
}

populateDatabase();
