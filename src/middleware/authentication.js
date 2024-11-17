const { UnauthenticatedError } = require("../error");
const { isTokenValid, checkTestUser } = require("../util");

const authenticateUser = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const user = isTokenValid(token);
    const testUser = checkTestUser(user.id);
    req.user = { ...user, testUser };
    return next();
  } catch (err) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = authenticateUser;
