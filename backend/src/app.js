const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
// const rateLimit = require("express-rate-limit"); //TODO:need to study
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");
const templateRoutes = require("./routes/template.routes");

const app = express();

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/api/user", userRoutes);
app.use("/api/template", templateRoutes);

// test routes
app.get("/test", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
