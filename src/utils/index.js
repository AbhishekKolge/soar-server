const { PORT } = require("./default");
const { shutdown, start } = require("./process");

module.exports = {
  PORT,
  shutdown,
  start,
};
