const { nodeMailerConfig } = require("./config");
const {
  PORT,
  GOOGLE_SCOPE,
  GOOGLE_SESSION,
  LOGIN_METHOD,
  TRANSACTION_METHOD,
  TRANSACTION_CATEGORY,
  VERIFICATION_CODE_EXPIRATION_TIME,
} = require("./default");
const {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
} = require("./email");
const { removeQuotes } = require("./format");
const { hashString, createRandomBytes, createRandomOtp } = require("./hash");
const { createJWT, isTokenValid, getJWTToken } = require("./jwt");
const passport = require("./passport");
const { checkPermissions } = require("./permission");
const { shutdown, start } = require("./process");
const {
  getOrigin,
  getUserAgent,
  getRequestIp,
  checkTestUser,
} = require("./request");
const { currentTime, checkTimeExpired, time } = require("./time");
const { createTokenUser } = require("./user");
const { joiPassword, joiContactNo } = require("./validation");

module.exports = {
  PORT,
  GOOGLE_SCOPE,
  GOOGLE_SESSION,
  LOGIN_METHOD,
  TRANSACTION_METHOD,
  TRANSACTION_CATEGORY,
  VERIFICATION_CODE_EXPIRATION_TIME,
  shutdown,
  start,
  nodeMailerConfig,
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
};
