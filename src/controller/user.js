const { StatusCodes } = require("http-status-codes");
const fs = require("fs").promises;

const prisma = require("../../prisma/prisma-client");

const retrieve = require("../retrieve-schema");
const { BadRequestError, NotFoundError } = require("../error");
const {
  MAX_IMAGE_SIZE,
  validateImage,
  deleteCloudinaryImage,
} = require("../util");

const showCurrentUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: retrieve.user,
  });

  res.status(StatusCodes.OK).json({ user });
};

const uploadProfileImage = async (req, res) => {
  try {
    const result = await validateImage("profileImage", "profile-images", req);

    const { profileImageId: oldProfileImageId } = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    await prisma.user.update({
      data: {
        profileImageUrl: result.secure_url,
        profileImageId: result.public_id,
      },
      where: {
        id: req.user.id,
      },
    });

    if (oldProfileImageId) {
      await deleteCloudinaryImage(oldProfileImageId);
    }

    res.status(StatusCodes.OK).json({
      profileImageUrl: result.secure_url,
    });
  } catch (error) {
    if (req.files?.profileImage) {
      await fs.unlink(req.files.profileImage.tempFilePath);
    }
    throw error;
  }
};

const removeProfileImage = async (req, res) => {
  const {
    query: { profileImageId },
    user: { id },
  } = req;

  if (!profileImageId) {
    throw new BadRequestError("Please provide profile image id");
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user.profileImageId) {
    throw new NotFoundError(`No file found with id of ${profileImageId}`);
  }

  if (user.profileImageId !== profileImageId) {
    throw new BadRequestError("Please provide valid image id");
  }

  await prisma.user.update({
    data: { profileImageUrl: null, profileImageId: null },
    where: {
      id,
    },
  });

  await deleteCloudinaryImage(profileImageId);

  res.status(StatusCodes.OK).json({
    msg: "Profile image removed successfully",
  });
};

const updateUser = async (req, res) => {
  const { id } = req.user;
  const { present, permanent, city, postalCode, countryId, ...userDetails } =
    req.body;

  await prisma.user.update({
    data: {
      ...userDetails,
      address: {
        update: { present, permanent, city, postalCode, countryId },
      },
    },
    where: {
      id,
    },
  });

  res.status(StatusCodes.OK).json({
    msg: "Profile updated successfully",
  });
};

const deleteUser = async (req, res) => {
  const { id } = req.user;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new NotFoundError(`No user found with id of ${id}`);
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });

  if (user.profileImageId) {
    await deleteCloudinaryImage(user.profileImageId);
  }

  res.status(StatusCodes.OK).json({
    msg: "Account deleted successfully",
  });
};

const updateSecurity = async (req, res) => {
  const { id } = req.user;

  await prisma.user.update({
    where: { id },
    data: {
      security: {
        update: req.body,
      },
    },
  });

  res.status(StatusCodes.OK).json({
    msg: "Security updated successfully",
  });
};

const getSecurity = async (req, res) => {
  const { id } = req.user;

  const security = await prisma.security.findFirst({
    where: { user: { id } },
    select: retrieve.security,
  });

  res.status(StatusCodes.OK).json({
    security,
  });
};

const updatePreference = async (req, res) => {
  const { id } = req.user;

  await prisma.user.update({
    where: { id },
    data: {
      notification: {
        update: req.body,
      },
    },
  });

  res.status(StatusCodes.OK).json({
    msg: "Preference updated successfully",
  });
};

const getPreference = async (req, res) => {
  const { id } = req.user;

  const preference = await prisma.notification.findFirst({
    where: { user: { id } },
    select: retrieve.preference,
  });

  res.status(StatusCodes.OK).json({
    preference,
  });
};

module.exports = {
  showCurrentUser,
  uploadProfileImage,
  removeProfileImage,
  updateUser,
  deleteUser,
  updateSecurity,
  getSecurity,
  updatePreference,
  getPreference,
};
