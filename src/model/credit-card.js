const { Decimal } = require("@prisma/client/runtime/library");
const { BadRequestError } = require("../error");
const {
  Encrypter,
  checkTimeExpired,
  TRANSACTION_METHOD_LIST,
  TRANSACTION_CATEGORY_LIST,
  getRandomDateFromOneYear,
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

const getRandomAmount = () => {
  const low = Math.random() > 0.5 ? 100 : 10;
  const high = Math.random() > 0.2 ? 5000 : 10000;
  return new Decimal(faker.finance.amount(low, high));
};

const generateTransactions = (cardId) => {
  const numOfTransactions = 1000;
  const transactions = [];

  const getRandomCategoryWeights = () => {
    const totalWeight = 1;

    const entertainmentWeight = Math.random() * 0.3 + 0.15;
    const investmentWeight = Math.random() * 0.2 + 0.1;
    const billExpenseWeight = Math.random() * 0.2 + 0.1;
    const othersWeight =
      totalWeight -
      (entertainmentWeight + investmentWeight + billExpenseWeight);

    return {
      ENTERTAINMENT: entertainmentWeight,
      INVESTMENT: investmentWeight,
      BILL_EXPENSE: billExpenseWeight,
      OTHERS: othersWeight,
    };
  };

  const methodWeights = {
    DEBIT: 0.4,
    CREDIT: 0.3,
  };

  const getWeightedMethod = () => {
    const random = Math.random();
    let cumulativeWeight = 0;
    for (let method of TRANSACTION_METHOD_LIST) {
      cumulativeWeight += methodWeights[method] || 0;
      if (random < cumulativeWeight) {
        return method;
      }
    }
    return TRANSACTION_METHOD_LIST[0];
  };

  const getWeightedCategory = (categoryWeights) => {
    const random = Math.random();
    let cumulativeWeight = 0;
    for (let category of TRANSACTION_CATEGORY_LIST) {
      cumulativeWeight += categoryWeights[category] || 0;
      if (random < cumulativeWeight) {
        return category;
      }
    }
    return TRANSACTION_CATEGORY_LIST[0];
  };

  for (let i = 0; i < numOfTransactions; i++) {
    const categoryWeights = getRandomCategoryWeights();
    const method = getWeightedMethod();
    const category = getWeightedCategory(categoryWeights);
    const amount = getRandomAmount();
    const createdAt = getRandomDateFromOneYear();

    const transaction = {
      method,
      amount,
      cardId,
      recipient: faker.finance.accountName(),
      note: faker.finance.transactionDescription(),
      category,
      createdAt: createdAt.toISOString(),
    };

    transactions.push(transaction);
  }

  return transactions;
};

module.exports = { CreditCard, generateTransactions };
