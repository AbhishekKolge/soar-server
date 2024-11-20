const { StatusCodes } = require("http-status-codes");
const fs = require("fs").promises;
const prisma = require("../../prisma/prisma-client");
const { CreditCard, generateTransactions } = require("../model");
const retrieve = require("../retrieve-schema");
const { NotFoundError, BadRequestError } = require("../error");
const { MAX_CARDS, uploadImage, deleteCloudinaryImage } = require("../util");
const { QueryBuilder } = require("../util");

const addAccount = async (req, res) => {
  let imageId = "";
  try {
    const { id } = req.user;
    const result = await uploadImage("image", "account-images", req);
    imageId = result.public_id;

    await prisma.account.create({
      data: {
        ...req.body,
        imageUrl: result.secure_url,
        imageId,
        userId: id,
      },
    });

    res.status(StatusCodes.CREATED).json({
      msg: "Account added successfully",
    });
  } catch (error) {
    if (imageId) {
      await deleteCloudinaryImage(imageId);
    } else if (req.files?.image?.tempFilePath) {
      await fs.unlink(req.files.image.tempFilePath);
    }
    throw error;
  }
};

const updateAccount = async (req, res) => {
  const {
    params: { id },
    body,
    user,
  } = req;

  const account = await prisma.account.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!account) {
    throw new NotFoundError(`No account found with id of ${id}`);
  }

  const updatedAccount = {
    ...body,
  };

  try {
    if (req.files?.image) {
      const result = await uploadImage("image", "account-images", req);
      updatedAccount.imageUrl = result.secure_url;
      updatedAccount.imageId = result.public_id;
    }

    await prisma.account.update({
      data: updatedAccount,
      where: {
        id,
      },
    });

    if (updatedAccount.imageId && account.imageId) {
      await deleteCloudinaryImage(account.imageId);
    }

    res.status(StatusCodes.OK).json({
      msg: "Account updated successfully",
    });
  } catch (error) {
    if (updatedAccount.imageId) {
      await deleteCloudinaryImage(updatedAccount.imageId);
    } else if (req.files?.image?.tempFilePath) {
      await fs.unlink(req.files.image.tempFilePath);
    }
    throw error;
  }
};

const deleteAccount = async (req, res) => {
  const {
    params: { id },
    user,
  } = req;

  const account = await prisma.account.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!account) {
    throw new NotFoundError(`No account found with id of ${id}`);
  }

  await prisma.account.delete({
    where: {
      id,
    },
  });

  res.status(StatusCodes.OK).json({
    msg: "Account deleted successfully",
  });
};

const getAccount = async (req, res) => {
  const { user, query } = req;

  const { page, sortKey, sortMethod, nullishSort, search, bankId } = query;

  const queryBuilder = new QueryBuilder({
    model: prisma.account,
    searchFields: ["number", "name", "identity"],
    sortKey,
    nullishSort,
  });

  const { results, totalCount, totalPages } = await queryBuilder
    .filter({
      search,
    })
    .filterIn({ bankId })
    .sort(sortMethod)
    .paginate(page)
    .selectWithIncludes(retrieve.account)
    .execute();

  res.status(StatusCodes.OK).json({
    results,
    totalCount,
    totalPages,
  });
};

module.exports = {
  addAccount,
  updateAccount,
  deleteAccount,
  getAccount,
};