const prisma = require("../../prisma/prisma-client");
const { StatusCodes } = require("http-status-codes");
const { Encrypter } = require("../util");

const getWeeklyActivity = async (req, res) => {
  const { id } = req.user;

  const creditCard = await prisma.card.findFirst({
    where: {
      userId: id,
      isSelected: true,
    },
  });

  if (!creditCard) {
    throw new NotFoundError("No active credit card found.");
  }

  const activity = await prisma.$queryRaw`
    SELECT 
        TO_CHAR("createdAt", 'YYYY-MM-DD') AS day,
        SUM(CASE WHEN method = 'DEBIT' THEN amount ELSE 0 END) AS debit,
        SUM(CASE WHEN method = 'CREDIT' THEN amount ELSE 0 END) AS credit
    FROM 
        "Transaction"
    WHERE 
        "createdAt" >= CURRENT_DATE - INTERVAL '6 days'
        AND "cardId" = ${creditCard.id}
    GROUP BY 
        day
    ORDER BY 
        day ASC;
`;

  res.status(StatusCodes.OK).json({ activity });
};

const getExpenseStatistics = async (req, res) => {
  const { id } = req.user;

  const creditCard = await prisma.card.findFirst({
    where: {
      userId: id,
      isSelected: true,
    },
  });

  if (!creditCard) {
    throw new NotFoundError("No active credit card found.");
  }

  const statistics = await prisma.$queryRaw`
  SELECT 
    category,
    (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Transaction" WHERE "cardId" = ${creditCard.id})) AS percentage
  FROM 
    "Transaction"
  WHERE
    "cardId" = ${creditCard.id}
  GROUP BY 
    category
  ORDER BY 
    percentage DESC;
`;

  res.status(StatusCodes.OK).json({ statistics });
};

const getBalanceHistory = async (req, res) => {
  const { id } = req.user;

  const creditCard = await prisma.card.findFirst({
    where: {
      userId: id,
      isSelected: true,
    },
  });

  if (!creditCard) {
    throw new NotFoundError("No active credit card found.");
  }

  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const transactions = await prisma.transaction.findMany({
    where: {
      cardId: creditCard.id,
      createdAt: {
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  let currentBalance =
    (
      await prisma.balance.findFirst({
        where: { card: { id: creditCard.id } },
      })
    )?.amount || "0";

  currentBalance = parseFloat(
    new Encrypter().decrypt(currentBalance.toString())
  );

  const getMonthStartDate = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  };

  let balance = [];
  let monthBalances = {};

  transactions.forEach((transaction) => {
    const monthStartDate = getMonthStartDate(transaction.createdAt);

    if (!monthBalances[monthStartDate]) {
      monthBalances[monthStartDate] = currentBalance;
    }
    monthBalances[monthStartDate] += parseFloat(transaction.amount.toString());
  });

  balance = Object.keys(monthBalances)
    .map((month) => ({
      date: month,
      balance: monthBalances[month],
    }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  res.status(StatusCodes.OK).json({ balance });
};

module.exports = {
  getWeeklyActivity,
  getExpenseStatistics,
  getBalanceHistory,
};
