const corsSetup = require("./cors");
const errorHandler = require("./error-handler");
const notFound = require("./not-found");
const rateLimiterSetup = require("./rate-limiter");
const { testUser } = require("./test-user");
const { validateRequest } = require("./validate-request");

module.exports = {
  corsSetup,
  errorHandler,
  notFound,
  rateLimiterSetup,
  testUser,
  validateRequest,
};
