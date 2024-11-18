const express = require("express");

const { getCountries } = require("../controller");

const utilsRouter = express.Router();

utilsRouter.route("/countries").get(getCountries);

module.exports = utilsRouter;
