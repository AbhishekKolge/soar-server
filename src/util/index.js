const { nodeMailerConfig } = require("./config");
const { PORT } = require("./default");
const {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
} = require("./email");
const { removeQuotes } = require("./format");
const { hashString, createRandomBytes, createRandomOtp } = require("./hash");
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

module.exports = {
  PORT,
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
};
