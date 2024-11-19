const {
  register,
  verify,
  forgotPassword,
  resetPassword,
  login,
  googleLogin,
} = require("./auth");
const {
  addCreditCard,
  updateCreditCard,
  getCreditCard,
  deleteCreditCard,
} = require("./credit-card");
const {
  showCurrentUser,
  uploadProfileImage,
  removeProfileImage,
  updateUser,
  deleteUser,
  updateSecurity,
  getSecurity,
  updatePreference,
  getPreference,
} = require("./user");
const { getCountries } = require("./utils");

module.exports = {
  register,
  verify,
  forgotPassword,
  resetPassword,
  login,
  googleLogin,
  getCountries,
  showCurrentUser,
  uploadProfileImage,
  removeProfileImage,
  updateUser,
  deleteUser,
  updateSecurity,
  getSecurity,
  updatePreference,
  getPreference,
  addCreditCard,
  updateCreditCard,
  deleteCreditCard,
  getCreditCard,
};
