const express = require("express");
const { home } = require("./controllers");

const app = express();
const port = 4000;

app.set("view engine", "ejs");
app.get("/", home);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
