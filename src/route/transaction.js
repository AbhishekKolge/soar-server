const express = require("express");

const { validateRequest, authenticateUser } = require("../middleware");
const { getTransaction, transferAmount } = require("../controller");
const { transferAmountSchema } = require("../validation");

const transactionRouter = express.Router();

transactionRouter.route("/").get(authenticateUser, getTransaction);
transactionRouter
  .route("/transfer/:id")
  .post(
    [authenticateUser, transferAmountSchema, validateRequest],
    transferAmount
  );

module.exports = transactionRouter;
