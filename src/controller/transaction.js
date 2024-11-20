const { StatusCodes } = require("http-status-codes");

const prisma = require("../../prisma/prisma-client");
const { QueryBuilder } = require("../util");
const retrieve = require("../retrieve-schema");
const { NotFoundError } = require("../error");

const getTransaction = async (req, res) => {
  const {
    params: { id: cardId },
    user,
    query,
  } = req;

  const {
    page,
    sortKey,
    sortMethod,
    nullishSort,
    search,
    category,
    accountId,
  } = query;

  const creditCard = await prisma.card.findUnique({
    where: {
      id: cardId,
      userId: user.id,
    },
  });

  if (!creditCard) {
    throw new NotFoundError(`No credit card found with id of ${cardId}`);
  }

  const queryBuilder = new QueryBuilder({
    model: prisma.transaction,
    searchFields: ["recipient", "note"],
    sortKey,
    nullishSort,
  });

  const { results, totalCount, totalPages } = await queryBuilder
    .filter({
      search,
    })
    .filterIn({ category, accountId, cardId })
    .sort(sortMethod)
    .paginate(page)
    .selectWithIncludes(retrieve.transaction)
    .execute();

  res.status(StatusCodes.OK).json({
    results,
    totalCount,
    totalPages,
  });
};

module.exports = {
  getTransaction,
};
