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

  const transactions = await prisma.$queryRaw`
    WITH last_seven_days AS (
      SELECT CURRENT_DATE - INTERVAL '1 day' * s.i AS day
      FROM generate_series(0, 6) AS s(i)
    )
    SELECT 
      TO_CHAR(day, 'YYYY-MM-DD') AS day,
      ROUND(COALESCE(SUM(CASE WHEN method = 'DEBIT' THEN amount ELSE 0 END), 0), 2) AS debit,
      ROUND(COALESCE(SUM(CASE WHEN method = 'CREDIT' THEN amount ELSE 0 END), 0), 2) AS credit
    FROM 
      last_seven_days
    LEFT JOIN "Transaction" 
      ON TO_CHAR("Transaction"."createdAt", 'YYYY-MM-DD') = TO_CHAR(last_seven_days.day, 'YYYY-MM-DD')
      AND "Transaction"."cardId" = ${creditCard.id}
    GROUP BY 
      day
    ORDER BY 
      day ASC;
  `;

  const activity = transactions.map((transaction) => {
    return {
      ...transaction,
      debit: +transaction.debit,
      credit: +transaction.credit,
    };
  });

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

  const expenses = await prisma.$queryRaw`
  SELECT 
    category,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Transaction" WHERE "cardId" = ${creditCard.id})), 2) AS percentage
  FROM 
    "Transaction"
  WHERE
    "cardId" = ${creditCard.id}
  GROUP BY 
    category
  ORDER BY 
    percentage DESC;
`;

  const statistics = expenses.map((expense) => {
    return {
      ...expense,
      percentage: +expense.percentage,
    };
  });

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

  const transactions = await prisma.$queryRaw`
  WITH WeeklyTransactions AS (
    SELECT 
      *,
      ROW_NUMBER() OVER (
        PARTITION BY DATE_TRUNC('week', "createdAt") 
        ORDER BY "createdAt" DESC
      ) AS rank
    FROM "Transaction"
    WHERE 
      "createdAt" >= NOW() - INTERVAL '8 weeks' 
      AND "cardId" = ${creditCard.id}
  )
  SELECT * 
  FROM WeeklyTransactions
  WHERE rank = 1;
`;

  const balance = transactions.map((transaction) => {
    return {
      date: transaction.createdAt,
      balance: +parseFloat(
        new Encrypter().decrypt(transaction.balance)
      ).toFixed(2),
    };
  });

  res.status(StatusCodes.OK).json({ balance });
};

module.exports = {
  getWeeklyActivity,
  getExpenseStatistics,
  getBalanceHistory,
};
