const app = require("./utils/app");
const db = require("./utils/db");
const recipeRoutes = require("./routes/recipes");

app.use("/", recipeRoutes);

app.listen(3033, () => {
  console.log("Server connected");
});
