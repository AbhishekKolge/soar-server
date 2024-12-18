const authRouter = require("./auth");
const userRouter = require("./user");
const utilsRouter = require("./utils");
const creditCardRouter = require("./credit-card");
const transactionRouter = require("./transaction");
const accountRouter = require("./account");
const analyticsRouter = require("./analytics");

module.exports = {
  authRouter,
  utilsRouter,
  userRouter,
  creditCardRouter,
  transactionRouter,
  accountRouter,
  analyticsRouter,
};
