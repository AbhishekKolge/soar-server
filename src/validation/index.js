const {
  addAccountSchema,
  updateAccountSchema,
  deleteAccountSchema,
} = require("./account");
const {
  registerSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginSchema,
} = require("./auth");
const {
  addCreditCardSchema,
  updateCreditCardSchema,
  deleteCreditCardSchema,
} = require("./credit-card");
const {
  uploadProfileImageSchema,
  removeProfileImageSchema,
  updateUserSchema,
  deleteUserSchema,
  updateSecuritySchema,
  updatePreferenceSchema,
} = require("./user");

module.exports = {
  registerSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginSchema,
  uploadProfileImageSchema,
  removeProfileImageSchema,
  updateUserSchema,
  deleteUserSchema,
  updateSecuritySchema,
  updatePreferenceSchema,
  addCreditCardSchema,
  updateCreditCardSchema,
  deleteCreditCardSchema,
  addAccountSchema,
  updateAccountSchema,
  deleteAccountSchema,
};
