const express = require("express");
const app = express();
const path = require("node:path");
const gamesRouter = require("./routes/gamesRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/", gamesRouter);

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, (errors) => {
  if (errors) {
    console.log(errors);
  }

  console.log(`Server is running on port ${PORT}`);
});
