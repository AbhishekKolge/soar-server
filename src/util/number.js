const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
};

const generateRandomAmount = (min, max, precision) => {
  const factor = Math.pow(10, precision);
  const randomNumber = Math.random() * (max - min) + min;
  return (Math.round(randomNumber * factor) / factor).toFixed(precision);
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  formatCurrency,
  generateRandomAmount,
  getRandomNumber,
};
