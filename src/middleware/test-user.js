const { UnauthorizedError } = require("../error");

const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new UnauthorizedError("Test user can't perform this action");
  }
  next();
};

module.exports = { testUser };
