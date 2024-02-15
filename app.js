const express = require("express");
const { home, province, invalid } = require("./controllers");

const app = express();
const port = 4000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", home);
app.get("/province", province);
app.get("/invalid", invalid);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
