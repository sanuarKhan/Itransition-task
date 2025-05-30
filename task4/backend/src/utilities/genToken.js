const jwt = require("jsonwebtoken");
const errorHandler = require("http-errors");
const { jwt_secret, jwt_expired_in } = require("../constants");

const genJWTToken = (user) => {
  const token = jwt.sign(user, jwt_secret, { expiresIn: jwt_expired_in });
  return token;
};

const decoded = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (err) {
    console.error(err);
    errorHandler(403, "Unauthorised attempts");
  }
};

module.exports = { genJWTToken, decoded };
