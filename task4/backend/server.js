const app = require("./src/app");
const { port } = require("./src/constants");

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
