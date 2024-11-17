const { PrismaClient } = require("@prisma/client");
const { isProductionEnv } = require("../src/util");

const prisma = global.prisma || new PrismaClient();

if (!isProductionEnv) {
  global.prisma = prisma;
}

module.exports = prisma;
