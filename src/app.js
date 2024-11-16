require("dotenv").config();

const express = require("express");
const { shutdown, start } = require("./utils");

const app = express();

app.use(express.json());

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start(app);
