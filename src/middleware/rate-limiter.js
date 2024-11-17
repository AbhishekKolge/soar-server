const rateLimiter = require("express-rate-limit");
const { isProductionEnv } = require("../util");

const rateLimiterSetup = rateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: "You have exceeded your 30 requests per minute limit.",
  headers: true,
});

if (isProductionEnv) {
  module.exports = rateLimiterSetup;
} else {
  console.log("Rate limiting is disabled in non-production environment.");
  module.exports = (req, res, next) => next();
}
