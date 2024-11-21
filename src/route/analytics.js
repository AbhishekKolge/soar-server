const express = require("express");

const { authenticateUser } = require("../middleware");
const {
  getWeeklyActivity,
  getExpenseStatistics,
  getBalanceHistory,
} = require("../controller");

const analyticsRouter = express.Router();

analyticsRouter.route("/activity").get(authenticateUser, getWeeklyActivity);
analyticsRouter.route("/expense").get(authenticateUser, getExpenseStatistics);
analyticsRouter.route("/balance").get(authenticateUser, getBalanceHistory);

module.exports = analyticsRouter;
