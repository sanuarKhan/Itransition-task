const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit"); //TODO:need to study

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/test", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
