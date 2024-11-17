const { UnauthorizedError } = require("../error");

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId) return;
  throw new UnauthorizedError("Not authorized to access this route");
};

module.exports = { checkPermissions };
