const prisma = require("../../prisma/prisma-client");
const { StatusCodes } = require("http-status-codes");

const getWeeklyActivity = async (req, res) => {
  const activity = await prisma.$queryRaw`
    SELECT 
        TO_CHAR("createdAt", 'YYYY-MM-DD') AS day,
        SUM(CASE WHEN method = 'DEBIT' THEN amount ELSE 0 END) AS debit,
        SUM(CASE WHEN method = 'CREDIT' THEN amount ELSE 0 END) AS credit
    FROM 
        "Transaction"
    WHERE 
        "createdAt" >= CURRENT_DATE - INTERVAL '6 days'
    GROUP BY 
        day
    ORDER BY 
        day ASC;
`;
  res.status(StatusCodes.OK).json({ activity });
};

const getExpenseStatistics = async (req, res) => {};

const getBalanceHistory = async (req, res) => {};

module.exports = {
  getWeeklyActivity,
  getExpenseStatistics,
  getBalanceHistory,
};
