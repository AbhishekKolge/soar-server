const PORT = process.env.PORT || 8000;
const GOOGLE_SCOPE = ["profile", "email"];
const GOOGLE_SESSION = false;
const LOGIN_METHOD = {
  google: "GOOGLE",
  normal: "NORMAL",
};
const TRANSACTION_METHOD = {
  debit: "DEBIT",
  credit: "CREDIT",
};
const TRANSACTION_CATEGORY = {
  entertainment: "ENTERTAINMENT",
  investment: "INVESTMENT",
  billExpense: "BILL_EXPENSE",
  others: "OTHERS",
};
const MAX_IMAGE_SIZE = 1024 * 1024;

module.exports = {
  PORT,
  GOOGLE_SCOPE,
  GOOGLE_SESSION,
  LOGIN_METHOD,
  TRANSACTION_METHOD,
  TRANSACTION_CATEGORY,
  MAX_IMAGE_SIZE,
};
