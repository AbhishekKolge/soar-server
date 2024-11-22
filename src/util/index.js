const { nodeMailerConfig, isProductionEnv } = require("./config");
const {
  PORT,
  GOOGLE_SCOPE,
  GOOGLE_SESSION,
  LOGIN_METHOD,
  TRANSACTION_METHOD,
  TRANSACTION_CATEGORY,
  MAX_IMAGE_SIZE,
  TRANSACTION_METHOD_LIST,
  TRANSACTION_CATEGORY_LIST,
  MAX_CARDS,
  TRANSACTION_METHOD_FORMAT,
  TRANSACTION_CATEGORY_FORMAT,
  MAX_TRANSACTIONS_PER_MONTH,
  STARTING_BALANCE,
} = require("./default");
const {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendLoginAlertNotificationEmail,
  sendTransactionAlertEmail,
} = require("./email");
const { Encrypter } = require("./encrypter");
const {
  uploadImage,
  deleteCloudinaryImage,
  uploadGoogleImage,
} = require("./file");
const { removeQuotes } = require("./format");
const { hashString, createRandomBytes, createRandomOtp } = require("./hash");
const { createJWT, isTokenValid, getJWTToken } = require("./jwt");
const {
  formatCurrency,
  generateRandomAmount,
  getRandomNumber,
} = require("./number");
const passport = require("./passport");
const { checkPermissions } = require("./permission");
const { shutdown, start } = require("./process");
const { QueryBuilder } = require("./query");
const {
  getOrigin,
  getUserAgent,
  getRequestIp,
  checkTestUser,
} = require("./request");
const {
  currentTime,
  checkTimeExpired,
  time,
  getCodeExpirationTimeOffset,
  getRandomDateFromOneYear,
  getDaysAgo,
  getIncrementingShuffledDays,
} = require("./time");
const { createTokenUser } = require("./user");
const { joiPassword, joiContactNo } = require("./validation");

module.exports = {
  PORT,
  GOOGLE_SCOPE,
  GOOGLE_SESSION,
  LOGIN_METHOD,
  TRANSACTION_METHOD,
  TRANSACTION_CATEGORY,
  shutdown,
  start,
  nodeMailerConfig,
  isProductionEnv,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  removeQuotes,
  hashString,
  createRandomBytes,
  createRandomOtp,
  checkPermissions,
  getOrigin,
  getUserAgent,
  getRequestIp,
  checkTestUser,
  currentTime,
  checkTimeExpired,
  time,
  createTokenUser,
  createJWT,
  isTokenValid,
  getJWTToken,
  passport,
  joiPassword,
  joiContactNo,
  getCodeExpirationTimeOffset,
  MAX_IMAGE_SIZE,
  uploadImage,
  deleteCloudinaryImage,
  uploadGoogleImage,
  sendLoginAlertNotificationEmail,
  Encrypter,
  TRANSACTION_METHOD_LIST,
  TRANSACTION_CATEGORY_LIST,
  MAX_CARDS,
  QueryBuilder,
  TRANSACTION_METHOD_FORMAT,
  TRANSACTION_CATEGORY_FORMAT,
  formatCurrency,
  sendTransactionAlertEmail,
  getRandomDateFromOneYear,
  getDaysAgo,
  getIncrementingShuffledDays,
  MAX_TRANSACTIONS_PER_MONTH,
  STARTING_BALANCE,
  generateRandomAmount,
  getRandomNumber,
};
