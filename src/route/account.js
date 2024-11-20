const express = require("express");

const {
  addAccountSchema,
  updateAccountSchema,
  deleteAccountSchema,
} = require("../validation");
const { validateRequest } = require("../middleware");
const { authenticateUser } = require("../middleware");
const {
  addAccount,
  updateAccount,
  deleteAccount,
  getAccount,
} = require("../controller");

const accountRouter = express.Router();

accountRouter
  .route("/")
  .get(authenticateUser, getAccount)
  .post([authenticateUser, addAccountSchema, validateRequest], addAccount);

accountRouter
  .route("/:id")
  .patch(
    [authenticateUser, updateAccountSchema, validateRequest],
    updateAccount
  )
  .delete(
    [authenticateUser, deleteAccountSchema, validateRequest],
    deleteAccount
  );

module.exports = accountRouter;
