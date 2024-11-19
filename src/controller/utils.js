const { StatusCodes } = require("http-status-codes");

const prisma = require("../../prisma/prisma-client");

const retrieve = require("../retrieve-schema");

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

module.exports = {
  getCountries,
};
