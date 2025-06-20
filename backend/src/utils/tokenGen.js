const jwt = require("jsonwebtoken");
const errorHandler = require("http-errors");
const { jwt_secret, jwt_expired_in } = require("../constants");

const genJWTToken = (user) => {
  const token = jwt.sign(user, jwt_secret, { expiresIn: jwt_expired_in });
  return token;
};

const decoded = (token) => {
  const decoded = jwt.verify(token, jwt_secret);
  return decoded;
};

module.exports = { genJWTToken, decoded };
