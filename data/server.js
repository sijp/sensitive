const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());

app.get("/professionals", (req, res) =>
  res.sendFile("./professionals.json", { root: __dirname })
);
app.get("/team", (req, res) =>
  res.sendFile("./team.json", { root: __dirname })
);

app.use(express.static("./images/"));

app.listen(5000);
