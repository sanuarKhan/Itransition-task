const express = require("express");

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
