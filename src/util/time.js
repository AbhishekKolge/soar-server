const currentTime = () => {
  return new Date();
};

const checkTimeExpired = (timeArg) => {
  const minute = 60000;
  return new Date(timeArg).getTime() - minute < Date.now();
};


const time = (timeArg) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };
  return new Date(timeArg).toLocaleDateString(undefined, options);
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
