const { StatusCodes } = require("http-status-codes");

const prisma = require("../../prisma/prisma-client");
const { Prisma } = require("@prisma/client");
const { CreditCard, generateTransactions } = require("../model");
const retrieve = require("../retrieve-schema");
const { NotFoundError, BadRequestError } = require("../error");
const { MAX_CARDS } = require("../util");

const addCreditCard = async (req, res) => {
  const { id } = req.user;
  const creditCardModel = new CreditCard(req.body);
  creditCardModel.checkValidity();
  creditCardModel.encryptPin();
  creditCardModel.generateBalance();
  creditCardModel.attachUser(id);

  const totalCreditCards = await prisma.card.count({
    where: {
      userId: id,
    },
  });

  if (totalCreditCards >= MAX_CARDS) {
    throw new BadRequestError("Maximum 6 cards can be added");
  }

  if (!totalCreditCards) {
    creditCardModel.setActive();
  }

  await prisma.$transaction(
    async (tx) => {
      if (creditCardModel.model.isSelected) {
        await tx.card.updateMany({
          where: { isSelected: true, userId: id },
          data: { isSelected: false },
        });
      }

      const creditCard = await tx.card.create({
        data: creditCardModel.model,
      });

      const transactions = generateTransactions(creditCard.id);

      await tx.transaction.createMany({
        data: transactions,
      });

      const lastTransaction = await tx.transaction.findFirst({
        where: {
          cardId: creditCard.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      await tx.balance.update({
        where: {
          id: creditCard.balanceId,
        },
        data: {
          amount: lastTransaction.balance,
        },
      });
    },
    {
      timeout: 120000,
      maxWait: 120000,
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    }
  );

  res.status(StatusCodes.CREATED).json({
    msg: "Credit card added successfully",
  });
};

const updateCreditCard = async (req, res) => {
  const {
    params: { id },
    body,
    user,
  } = req;

  const creditCard = await prisma.card.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!creditCard) {
    throw new NotFoundError(`No credit card found with id of ${id}`);
  }

  const creditCardModel = new CreditCard(body);
  creditCardModel.encryptPin();

  await prisma.$transaction(async (tx) => {
    if (creditCardModel.model.isSelected) {
      await tx.card.updateMany({
        where: { isSelected: true, userId: user.id },
        data: { isSelected: false },
      });
    }

    if (!creditCardModel.model.isSelected && creditCard.isSelected) {
      const newSelectedCard = await tx.card.findFirst({
        where: { isSelected: false, userId: user.id },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (newSelectedCard) {
        await tx.card.update({
          where: { id: newSelectedCard.id },
          data: { isSelected: true },
        });
      } else {
        throw new BadRequestError("At least one card should set to active");
      }
    }

    await tx.card.update({
      data: creditCardModel.model,
      where: {
        id,
      },
    });
  });

  res.status(StatusCodes.OK).json({
    msg: "Credit card updated successfully",
  });
};

const deleteCreditCard = async (req, res) => {
  const {
    params: { id },
    user,
  } = req;

  const creditCard = await prisma.card.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!creditCard) {
    throw new NotFoundError(`No credit card found with id of ${id}`);
  }

  await prisma.$transaction(async (tx) => {
    if (creditCard.isSelected) {
      const newSelectedCard = await tx.card.findFirst({
        where: { isSelected: false, userId: user.id },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (newSelectedCard) {
        await tx.card.update({
          where: { id: newSelectedCard.id },
          data: { isSelected: true },
        });
      }
    }

    await tx.card.delete({
      where: {
        id,
      },
    });
  });

  res.status(StatusCodes.OK).json({
    msg: "Credit card deleted successfully",
  });
};

const getCreditCard = async (req, res) => {
  const { id } = req.user;

  let creditCards = await prisma.card.findMany({
    where: {
      userId: id,
    },
    select: retrieve.creditCard,
    orderBy: {
      createdAt: "desc",
    },
  });

  creditCards = creditCards.map((card) => {
    const creditCardModel = new CreditCard(card);
    creditCardModel.decryptBalance();
    creditCardModel.decryptPin();
    return creditCardModel.model;
  });

  res.status(StatusCodes.OK).json({ creditCards });
};

module.exports = {
  addCreditCard,
  updateCreditCard,
  deleteCreditCard,
  getCreditCard,
};
