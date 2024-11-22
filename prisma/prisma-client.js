const { PrismaClient } = require("@prisma/client");

const prisma =
  global.prisma ||
  new PrismaClient({
    transactionOptions: {
      maxWait: 8000,
      timeout: 10000,
    },
  });

global.prisma = prisma;

module.exports = prisma;
