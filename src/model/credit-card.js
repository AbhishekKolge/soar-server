const { Decimal } = require("@prisma/client/runtime/library");
const { BadRequestError } = require("../error");
const {
  Encrypter,
  checkTimeExpired,
  TRANSACTION_METHOD_LIST,
  TRANSACTION_CATEGORY_LIST,
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
  const numOfTransactions = 50;
  const transactions = [];

  for (let i = 0; i < numOfTransactions; i++) {
    const method =
      TRANSACTION_METHOD_LIST[
        Math.floor(Math.random() * TRANSACTION_METHOD_LIST.length)
      ];
    const category =
      TRANSACTION_CATEGORY_LIST[
        Math.floor(Math.random() * TRANSACTION_CATEGORY_LIST.length)
      ];

    const amount = new Decimal(faker.finance.amount());

    const transaction = {
      method,
      amount,
      cardId,
      recipient: faker.finance.accountName(),
      note: faker.finance.transactionDescription(),
      category,
    };

    transactions.push(transaction);
  }

  return transactions;
};

module.exports = { CreditCard, generateTransactions };
