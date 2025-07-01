const jwt = require("jsonwebtoken");
const { jwt_secret, jwt_expired_in } = require("../constants");

const genJWTToken = (userId) => {
  const token = jwt.sign({userId}, jwt_secret, { expiresIn: jwt_expired_in });
  return token;
};

const decoded = (token) => {
  const decoded = jwt.verify(token, jwt_secret);

  return decoded;
};

module.exports = { genJWTToken, decoded };
