require("dotenv").config();
require("express-async-errors");

const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const cloudinary = require("cloudinary").v2;

const {
  rateLimiterSetup,
  corsSetup,
  notFound,
  errorHandler,
} = require("./middleware");

const { shutdown, start } = require("./util");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json());
app.use(corsSetup);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(morgan("tiny"));
app.use(rateLimiterSetup);

app.use(notFound);
app.use(errorHandler);

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start(app);
