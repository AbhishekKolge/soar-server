const createTokenUser = ({ id, username, email, profileImageUrl }) => {
  return { id, username, email, profileImageUrl };
};

module.exports = {
  createTokenUser,
};
