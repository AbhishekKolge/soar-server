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

const getRandomDateFromOneYear = () => {
  const randomDaysAgo = Math.floor(Math.random() * 365);
  const date = new Date();
  date.setDate(date.getDate() - randomDaysAgo);

  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);
  const randomSeconds = Math.floor(Math.random() * 60);

  date.setHours(randomHours, randomMinutes, randomSeconds);

  const twoHoursAgo = new Date();
  twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

  if (date >= twoHoursAgo) {
    date.setTime(twoHoursAgo.getTime());
  }

  return date;
};

const getDaysAgo = (days) => {
  const day = new Date();
  day.setDate(day.getDate() - days);
  return day;
};

const getIncrementingShuffledDays = (daysInMonth, maxTransactions) => {
  let selectedDays = [];

  let interval = Math.floor(daysInMonth.length / maxTransactions);

  for (let i = 0; i < maxTransactions; i++) {
    let startIdx = i * interval;
    let endIdx = startIdx + interval;

    if (i === maxTransactions - 1) {
      endIdx = daysInMonth.length;
    }

    let randomIdx = Math.floor(Math.random() * (endIdx - startIdx)) + startIdx;
    selectedDays.push(daysInMonth[randomIdx]);
  }

  selectedDays.sort((a, b) => a - b);

  return selectedDays;
};

module.exports = {
  currentTime,
  checkTimeExpired,
  time,
  getCodeExpirationTimeOffset,
  getRandomDateFromOneYear,
  getDaysAgo,
  getIncrementingShuffledDays,
};
