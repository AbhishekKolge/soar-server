const CustomError = require("../error");
const customUtils = require("../util");

const authenticateUser = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }

  try {
    const user = customUtils.isTokenValid(token);
    const testUser = customUtils.checkTestUser(user.id);
    req.user = { ...user, testUser };
    return next();
  } catch (err) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
};

module.exports = authenticateUser;
