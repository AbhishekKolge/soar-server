const { StatusCodes } = require("http-status-codes");

const prisma = require("../../prisma/prisma-client");
const {
  QueryBuilder,
  TRANSACTION_METHOD_FORMAT,
  TRANSACTION_CATEGORY_FORMAT,
} = require("../util");
const retrieve = require("../retrieve-schema");
const { NotFoundError } = require("../error");

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

module.exports = {
  getTransaction,
};
