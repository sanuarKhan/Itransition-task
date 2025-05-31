const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");

const app = express();

// middleware
app.use(
  cors({
    origin: ["https://usermanagement-be4.pages.dev", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// test route
app.get("/test", (req, res) => {
  res.send("Hello World!");
});

// routes
app.use("/api/v1/user", userRoutes);

// error handling
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send(error.message);
});

module.exports = app;
