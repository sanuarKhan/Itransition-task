const pool = require("./pool");

// register user
const registerUserQuery = async (name, email, password) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const loginUserQuery = async (email, password) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};
// get all users by loging_time
const getUsersQuery = async () => {
  try {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY last_login DESC"
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

//block user
const blockUserQuery = async (id) => {
  try {
    const result = await pool.query(
      "UPDATE users SET status = 'blocked' WHERE id = $1",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
};
// unblock user
const unblockUserQuery = async (id) => {
  try {
    await pool.query("UPDATE users SET status = 'active' WHERE id = $1", [id]);
    return;
  } catch (error) {
    console.error("Error unblocking user:", error);
    throw error;
  }
};
// delete user
const deleteUserQuery = async (id) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

const updateLastLoginTimeQuery = async (email) => {
  try {
    const result = await pool.query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = $1",
      [email]
    );
    return;
  } catch (error) {
    console.error("Error deleting selected users:", error);
    throw error;
  }
};

module.exports = {
  getUsersQuery,
  registerUserQuery,
  loginUserQuery,
  blockUserQuery,
  unblockUserQuery,
  deleteUserQuery,
  updateLastLoginTimeQuery,
};
