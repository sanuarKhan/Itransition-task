const express = require("express");
const app = express();
const cors = require("cors");
const bookRoutes = require("./src/routes/bookRoutes");

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/test", (req, res) => {
  res.send("Hello World!");
});
app.use("/", bookRoutes);

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
