const {
  addAccount,
  updateAccount,
  deleteAccount,
  getAccount,
} = require("./account");
const {
  getWeeklyActivity,
  getExpenseStatistics,
  getBalanceHistory,
} = require("./analytics");
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
const { getTransaction, transferAmount } = require("./transaction");
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
const { getCountries, getBanks } = require("./utils");

module.exports = {
  register,
  verify,
  forgotPassword,
  resetPassword,
  login,
  googleLogin,
  getCountries,
  getBanks,
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
  getTransaction,
  addAccount,
  updateAccount,
  deleteAccount,
  getAccount,
  transferAmount,
  getWeeklyActivity,
  getExpenseStatistics,
  getBalanceHistory,
};
