const app = require("./src/app");
const { port } = require("./src/constants");
console.log(port);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
