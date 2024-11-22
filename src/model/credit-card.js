const { Decimal } = require("@prisma/client/runtime/library");
const { BadRequestError } = require("../error");
const {
  Encrypter,
  checkTimeExpired,
  TRANSACTION_METHOD_LIST,
  TRANSACTION_CATEGORY_LIST,
  TRANSACTION_METHOD,
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
  const startDate = new Date(currentDate);
  startDate.setMonth(currentDate.getMonth() - 5);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(currentDate);
  endDate.setHours(currentDate.getHours() - 2, 0, 0, 0);

  return generateTransactionForPeriod(startDate, endDate, cardId);
};

const generateTransactionForPeriod = (startDate, endDate, cardId) => {
  let currentBalance = STARTING_BALANCE;
  let transactions = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dailyTransactions = getRandomNumber(1, 3);
    const transactionDate = new Date(currentDate);

    for (let i = 0; i < dailyTransactions; i++) {
      transactionDate.setHours(
        getRandomNumber(0, 23),
        getRandomNumber(0, 59),
        0,
        0
      );

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
        currentBalance += parseFloat(amount);
      } else {
        currentBalance -= parseFloat(amount);
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
          createdAt: transactionDate.toISOString(),
        });
      } else {
        currentBalance +=
          method === TRANSACTION_METHOD.credit
            ? -parseFloat(amount)
            : parseFloat(amount);
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return transactions;
};

module.exports = { CreditCard, generateTransactions };
