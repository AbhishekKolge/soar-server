const {
  register,
  verify,
  forgotPassword,
  resetPassword,
  login,
  googleLogin,
} = require("./auth");
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
};
