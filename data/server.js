const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());

app.get("/professionals", (req, res) =>
  res.sendFile("./data/professionals.json", { root: __dirname })
);
app.get("/team", (req, res) =>
  res.sendFile("./data/team.json", { root: __dirname })
);

app.use(express.static("./data/images/"));
app.use("/articles/", express.static("./data/articles/"));

app.listen(5000);
