const crypto = require("crypto");
const otpGenerator = require("otp-generator");

const createRandomBytes = (count = 40) => {
  return crypto.randomBytes(count).toString("hex");
};

const hashString = (string) => {
  return crypto.createHash("sha256").update(string, "utf8").digest("hex");
};

const createRandomOtp = (length = 6) => {
  return otpGenerator.generate(length, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

module.exports = {
  hashString,
  createRandomBytes,
  createRandomOtp,
};
