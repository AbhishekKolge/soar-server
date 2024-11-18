const {
  register,
  verify,
  forgotPassword,
  resetPassword,
  login,
  googleLogin,
} = require("./auth");
const { getCountries } = require("./utils");

module.exports = {
  register,
  verify,
  forgotPassword,
  resetPassword,
  login,
  googleLogin,
  getCountries,
};
