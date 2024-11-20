const { StatusCodes } = require("http-status-codes");

const prisma = require("../../prisma/prisma-client");
const {
  QueryBuilder,
  TRANSACTION_METHOD_FORMAT,
  TRANSACTION_CATEGORY_FORMAT,
  TRANSACTION_METHOD,
  TRANSACTION_CATEGORY,
  sendTransactionAlertEmail,
  Encrypter,
} = require("../util");
const retrieve = require("../retrieve-schema");
const { NotFoundError } = require("../error");
const { CreditCard } = require("../model");
const { Decimal } = require("@prisma/client/runtime/library");

const getTransaction = async (req, res) => {
  const { user, query } = req;

  const {
    page,
    sortKey,
    sortMethod,
    nullishSort,
    search,
    category,
    method,
    accountId,
  } = query;

  const creditCard = await prisma.card.findFirst({
    where: {
      userId: user.id,
      isSelected: true,
    },
  });

  if (!creditCard) {
    throw new NotFoundError("No active credit card found.");
  }

  const queryBuilder = new QueryBuilder({
    model: prisma.transaction,
    searchFields: ["recipient", "note"],
    sortKey,
    nullishSort,
  });

  let { results, totalCount, totalPages } = await queryBuilder
    .filter({
      search,
    })
    .filterIn({ category, method, accountId, cardId: creditCard.id })
    .sort(sortMethod)
    .paginate(page)
    .selectWithIncludes(retrieve.transaction)
    .execute();

  results = results.map((result) => {
    return {
      ...result,
      method: TRANSACTION_METHOD_FORMAT[result.method],
      category: TRANSACTION_CATEGORY_FORMAT[result.category],
    };
  });

  res.status(StatusCodes.OK).json({
    results,
    totalCount,
    totalPages,
  });
};

const transferAmount = async (req, res) => {
  const {
    params: { id },
    body,
    user,
  } = req;

  const creditCard = await prisma.card.findFirst({
    where: {
      userId: user.id,
      isSelected: true,
    },
    include: {
      balance: true,
    },
  });

  if (!creditCard) {
    throw new NotFoundError("No active credit card found");
  }

  const creditCardModel = new CreditCard(creditCard);
  creditCardModel.decryptPin();

  const account = await prisma.account.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!account) {
    throw new NotFoundError(`No account found with id of ${id}`);
  }

  creditCardModel.checkValidity();
  creditCardModel.comparePin(body.pin);
  creditCardModel.decryptBalance();
  creditCardModel.validateTransfer(body.amount);

  await prisma.transaction.create({
    data: {
      method: TRANSACTION_METHOD.debit,
      amount: new Decimal(body.amount),
      cardId: creditCard.id,
      accountId: account.id,
      recipient: account.name,
      category: TRANSACTION_CATEGORY.others,
    },
  });

  const balance = creditCardModel.getRemainingBalance(body.amount);

  await prisma.balance.update({
    where: {
      id: creditCard.balanceId,
    },
    data: {
      amount: new Encrypter().encrypt(balance.toString()),
    },
  });

  res.status(StatusCodes.OK).json({
    msg: "Transferred successfully",
  });

  const userDetails = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      notification: true,
    },
  });

  if (userDetails.notification.transactionAlert) {
    sendTransactionAlertEmail({
      name: userDetails.name,
      email: userDetails.email,
      amount: body.amount,
      balance,
      recipient: account.name,
    });
  }
};

module.exports = {
  getTransaction,
  transferAmount,
};
