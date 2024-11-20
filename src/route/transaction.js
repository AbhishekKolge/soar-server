const express = require("express");

const { validateRequest } = require("../middleware");
const { authenticateUser } = require("../middleware");
const { getTransaction } = require("../controller");

const transactionRouter = express.Router();

transactionRouter.route("/:id").get(authenticateUser, getTransaction);

module.exports = transactionRouter;
