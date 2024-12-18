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
const TRANSACTION_METHOD_LIST = [
  TRANSACTION_METHOD.debit,
  TRANSACTION_METHOD.credit,
];
const TRANSACTION_CATEGORY_LIST = [
  TRANSACTION_CATEGORY.entertainment,
  TRANSACTION_CATEGORY.investment,
  TRANSACTION_CATEGORY.billExpense,
  TRANSACTION_CATEGORY.others,
];
const TRANSACTION_METHOD_FORMAT = {
  [TRANSACTION_METHOD.debit]: "Debit",
  [TRANSACTION_METHOD.credit]: "Credit",
};
const TRANSACTION_CATEGORY_FORMAT = {
  [TRANSACTION_CATEGORY.entertainment]: "Entertainment",
  [TRANSACTION_CATEGORY.investment]: "Investment",
  [TRANSACTION_CATEGORY.billExpense]: "Bill Expense",
  [TRANSACTION_CATEGORY.others]: "Others",
};

const MAX_IMAGE_SIZE = 1024 * 1024;
const MAX_CARDS = 6;
const STARTING_BALANCE = 10000;

module.exports = {
  PORT,
  GOOGLE_SCOPE,
  GOOGLE_SESSION,
  LOGIN_METHOD,
  TRANSACTION_METHOD,
  TRANSACTION_CATEGORY,
  MAX_IMAGE_SIZE,
  TRANSACTION_METHOD_LIST,
  TRANSACTION_CATEGORY_LIST,
  MAX_CARDS,
  TRANSACTION_METHOD_FORMAT,
  TRANSACTION_CATEGORY_FORMAT,
  STARTING_BALANCE,
};
