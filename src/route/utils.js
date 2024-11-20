const express = require("express");

const { getCountries, getBanks } = require("../controller");

const utilsRouter = express.Router();

utilsRouter.route("/countries").get(getCountries);
utilsRouter.route("/bank").get(getBanks);

module.exports = utilsRouter;
