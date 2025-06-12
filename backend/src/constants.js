const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
console.log(port);

module.exports = {
  port,
};
