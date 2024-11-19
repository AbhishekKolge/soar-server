const {
  registerSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginSchema,
} = require("./auth");
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
};
