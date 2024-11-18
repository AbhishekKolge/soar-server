const { StatusCodes } = require("http-status-codes");

const prisma = require("../../prisma/prisma-client");

const getCountries = async (req, res) => {
  const countries = await prisma.country.findMany({
    select: {
      id: true,
      name: true,
      shortName: true,
      phoneCode: true,
    },
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
