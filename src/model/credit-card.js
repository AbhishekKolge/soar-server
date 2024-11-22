const { Decimal } = require("@prisma/client/runtime/library");
const { BadRequestError } = require("../error");
const {
  Encrypter,
  checkTimeExpired,
  TRANSACTION_METHOD_LIST,
  TRANSACTION_CATEGORY_LIST,
  TRANSACTION_METHOD,
  getIncrementingShuffledDays,
  MAX_TRANSACTIONS_PER_MONTH,
  STARTING_BALANCE,
  generateRandomAmount,
  getRandomNumber,
} = require("../util");
const { faker } = require("@faker-js/faker");

class CreditCard {
  constructor(model) {
    this.model = model;
  }

  encryptPin() {
    if (this.model.pin) {
      const encryptedPin = new Encrypter().encrypt(this.model.pin);
      this.model.pin = encryptedPin;
    }
    return this.model;
  }

  decryptPin() {
    const decryptedPin = new Encrypter().decrypt(this.model.pin);
    this.model.pin = decryptedPin;
    return this.model;
  }

  generateBalance() {
    const minBalance = 1000;
    const maxBalance = 10000;

    const balance = (
      Math.random() * (maxBalance - minBalance) +
      minBalance
    ).toFixed(2);

    const encryptedBalance = new Encrypter().encrypt(balance.toString());

    this.model = {
      ...this.model,
      balance: {
        create: {
          amount: encryptedBalance,
        },
      },
    };

    return this.model;
  }

  decryptBalance() {
    const decryptedAmount = new Encrypter().decrypt(this.model.balance.amount);

    this.model.balance.amount = decryptedAmount;

    return this.model;
  }

  attachUser(id) {
    this.model.user = {
      connect: { id },
    };

    return this.model;
  }

  checkValidity() {
    const isExpired = checkTimeExpired(this.model.validity);
    if (isExpired) {
      throw new BadRequestError("Card validity expired");
    }
  }

  setActive() {
    this.model.isSelected = true;
    return this.model;
  }

  comparePin(pin) {
    if (pin !== this.model.pin) {
      throw new BadRequestError("Please enter correct pin");
    }
  }

  validateTransfer(amount) {
    if (+this.model.balance.amount < +amount) {
      throw new BadRequestError("Sufficient balance not available");
    }
  }

  getRemainingBalance(amount) {
    return +this.model.balance.amount - +amount;
  }
}

const generateTransactions = (cardId) => {
  const currentDate = new Date();
  const startDate = new Date();
  startDate.setMonth(currentDate.getMonth() - 5);

  let transactions = [];

  for (let month = 0; month < 6; month++) {
    const monthStartDate = new Date(startDate);
    monthStartDate.setMonth(startDate.getMonth() + month);
    monthStartDate.setDate(1);

    let monthEndDate = new Date(monthStartDate);
    monthEndDate.setMonth(monthStartDate.getMonth() + 1);
    monthEndDate.setDate(0);

    if (month === 5) {
      monthEndDate = new Date(currentDate);
      monthEndDate.setHours(currentDate.getHours() - 2);
      monthEndDate.setMinutes(0);
      monthEndDate.setSeconds(0);
      monthEndDate.setMilliseconds(0);
    }

    const monthTransaction = generateTransactionForMonth({
      monthStartDate,
      monthEndDate,
      cardId,
    });

    transactions.push(...monthTransaction);
  }

  return transactions;
};

const generateTransactionForMonth = ({
  monthStartDate,
  monthEndDate,
  cardId,
}) => {
  let currentBalance = STARTING_BALANCE;
  let transactions = [];
  let daysInMonth = [];
  let currentDate = new Date(monthStartDate);

  while (currentDate <= monthEndDate) {
    daysInMonth.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  let selectedDays = getIncrementingShuffledDays(
    daysInMonth,
    MAX_TRANSACTIONS_PER_MONTH
  );

  for (let i = 0; i < selectedDays.length; i++) {
    const date = new Date(selectedDays[i]);
    date.setHours(date.getHours() + Math.floor(Math.random() * 5) + 1);
    date.setMinutes(date.getMinutes() + Math.floor(Math.random() * 60));

    const transactionLimit = getRandomNumber(2, 5);

    for (let j = 0; j < transactionLimit; j++) {
      let fallbackBalance = currentBalance;
      const method =
        TRANSACTION_METHOD_LIST[
          Math.floor(Math.random() * TRANSACTION_METHOD_LIST.length)
        ];
      const category =
        TRANSACTION_CATEGORY_LIST[
          Math.floor(Math.random() * TRANSACTION_CATEGORY_LIST.length)
        ];

      const amount = generateRandomAmount(500, 2000, 2);

      if (method === TRANSACTION_METHOD.credit) {
        currentBalance = currentBalance + parseFloat(amount);
      }
      if (method === TRANSACTION_METHOD.debit) {
        currentBalance = currentBalance - parseFloat(amount);
      }
      if (currentBalance <= STARTING_BALANCE && currentBalance >= 0) {
        transactions.push({
          method,
          amount: new Decimal(amount),
          balance: new Encrypter().encrypt(
            currentBalance.toFixed(2).toString()
          ),
          cardId,
          recipient: faker.finance.accountName(),
          note: faker.finance.transactionDescription(),
          category,
          createdAt: date.toISOString(),
        });
        date.setHours(date.getHours() + Math.floor(Math.random() * 5) + 1);
        date.setMinutes(date.getMinutes() + Math.floor(Math.random() * 60));
      } else {
        currentBalance = fallbackBalance;
      }
    }
  }

  return transactions;
};

module.exports = { CreditCard, generateTransactions };
