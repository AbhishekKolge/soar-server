const express = require("express");

const {
  addCreditCardSchema,
  updateCreditCardSchema,
  deleteCreditCardSchema,
} = require("../validation");
const { validateRequest } = require("../middleware");
const { authenticateUser } = require("../middleware");
const {
  addCreditCard,
  updateCreditCard,
  deleteCreditCard,
  getCreditCard,
} = require("../controller");

const creditCardRouter = express.Router();

creditCardRouter
  .route("/")
  .get(authenticateUser, getCreditCard)
  .post(
    [authenticateUser, addCreditCardSchema, validateRequest],
    addCreditCard
  );

creditCardRouter
  .route("/:id")
  .patch(
    [authenticateUser, updateCreditCardSchema, validateRequest],
    updateCreditCard
  )
  .delete(
    [authenticateUser, deleteCreditCardSchema, validateRequest],
    deleteCreditCard
  );

module.exports = creditCardRouter;
