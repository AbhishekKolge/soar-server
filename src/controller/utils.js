const { StatusCodes } = require("http-status-codes");

const prisma = require("../../prisma/prisma-client");

const retrieve = require("../retrieve-schema");
const { QueryBuilder } = require("../util");

const getCountries = async (req, res) => {
  const countries = await prisma.country.findMany({
    select: retrieve.countries,
    orderBy: {
      name: "asc",
    },
  });

  res.status(StatusCodes.OK).json({
    countries,
  });
};

const getBanks = async (req, res) => {
  const { page, search } = req.query;

  const queryBuilder = new QueryBuilder({
    model: prisma.bank,
    searchFields: ["name"],
    sortKey: "name",
  });

  const { results, totalCount, totalPages } = await queryBuilder
    .filter({
      search,
    })
    .sort("lowest")
    .paginate(page)
    .select(["id", "name"])
    .execute();

  res.status(StatusCodes.OK).json({ results, totalCount, totalPages });
};

module.exports = {
  getCountries,
  getBanks,
};
