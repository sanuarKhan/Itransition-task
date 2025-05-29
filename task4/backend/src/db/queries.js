const pool = require("./pool");

// register user
const registerUser = async (name, email, password) => {
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

const loginUser = async (email, password) => {
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
const getUsers = async () => {
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
const blockUser = async (id) => {
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
const unblockUser = async (id) => {
  try {
    const result = await pool.query(
      "UPDATE users SET status = 'active' WHERE id = $1",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error unblocking user:", error);
    throw error;
  }
};
// delete user
const deleteUser = async (id) => {
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// delete selected users
const deleteSlectedUsers = async () => {
  try {
    const result = await pool.query("DELETE FROM users WHERE selected = true");
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting selected users:", error);
    throw error;
  }
};

module.exports = { getUsers };
