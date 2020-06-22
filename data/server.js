const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());

app.get("*", (req, res) => res.sendFile("./trainers.csv", { root: __dirname }));

app.listen(5000);
