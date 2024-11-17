const currentTime = () => {
  return new Date();
};

const checkTimeExpired = (timeArg) => {
  const minute = 60000;
  return new Date(timeArg).getTime() - minute < Date.now();
};

const time = (timeArg) => {
  return new Date(timeArg);
};

const getCodeExpirationTimeOffset = () => {
  return new Date(Date.now() + 1000 * 60 * 10);
};

module.exports = {
  currentTime,
  checkTimeExpired,
  time,
  getCodeExpirationTimeOffset,
};
