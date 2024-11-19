const { StatusCodes } = require("http-status-codes");

const prisma = require("../../prisma/prisma-client");

const {
  createRandomOtp,
  sendVerificationEmail,
  LOGIN_METHOD,
  getCodeExpirationTimeOffset,
  currentTime,
  hashString,
  sendResetPasswordEmail,
  createTokenUser,
  getJWTToken,
  sendLoginAlertNotificationEmail,
} = require("../util");
const { User } = require("../model");
const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
} = require("../error");

const register = async (req, res) => {
  const verificationCode = createRandomOtp();
  console.log({ verificationCode });

  const userModel = new User({
    ...req.body,
    verificationCode: hashString(verificationCode),
    verificationCodeExpiration: getCodeExpirationTimeOffset(),
    loginMethod: LOGIN_METHOD.normal,
  });

  await userModel.encryptPassword();
  userModel.createPreference();

  const user = await prisma.user.create({
    data: userModel.model,
  });

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationCode,
  });

  res.status(StatusCodes.CREATED).json({
    msg: `Email verification code sent to ${user.email}`,
  });
};

const verify = async (req, res) => {
  const { email, code } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new UnauthenticatedError("Verification failed");
  }

  if (user.isVerified) {
    throw new BadRequestError("Already verified");
  }

  new User(user).compareVerificationCode(code);

  await prisma.user.update({
    data: {
      isVerified: true,
      verifiedAt: currentTime(),
      verificationCode: null,
      verificationCodeExpiration: null,
    },
    where: {
      email,
    },
  });

  res.status(StatusCodes.OK).json({ msg: "Email verified successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new NotFoundError(`${email} does not exist, please register`);
  }

  const userModel = new User(user);
  if (userModel.isGoogleUser()) {
    throw new BadRequestError(`Please login via google`);
  }
  userModel.checkResetPasswordCodeValidity();

  const resetPasswordCode = createRandomOtp();
  console.log({ resetPasswordCode });

  await prisma.user.update({
    data: {
      resetPasswordCode: hashString(resetPasswordCode),
      resetPasswordCodeExpiration: getCodeExpirationTimeOffset(),
    },
    where: {
      email,
    },
  });

  await sendResetPasswordEmail({
    name: user.firstName,
    email: user.email,
    resetPasswordCode,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: `Password reset code sent to ${user.email}` });
};

const resetPassword = async (req, res) => {
  const { code, email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new UnauthenticatedError("Verification failed");
  }

  const userModel = new User({
    ...user,
    password,
  });

  if (userModel.isGoogleUser()) {
    throw new BadRequestError(`Please login via google`);
  }

  userModel.verifyResetPasswordCode(code);
  await userModel.encryptPassword();

  await prisma.user.update({
    data: {
      password: userModel.model.password,
      resetPasswordCode: null,
      resetPasswordCodeExpiration: null,
    },
    where: {
      email,
    },
  });

  res.status(StatusCodes.OK).json({ msg: "Password changed successfully" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      notification: true,
    },
  });

  if (!user) {
    throw new NotFoundError(`${email} does not exist, please register`);
  }

  const userModel = new User(user);
  if (userModel.isGoogleUser()) {
    throw new BadRequestError(`Please login via google`);
  }
  await userModel.comparePassword(password);
  userModel.checkAuthorized();

  const tokenUser = createTokenUser(user);
  const token = getJWTToken(tokenUser);

  res.status(StatusCodes.OK).json({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    token,
  });

  if (user.notification.loginAlert) {
    sendLoginAlertNotificationEmail({
      name: user.name,
      email: user.email,
    });
  }
};

const googleLogin = async (req, res) => {
  const { user: googleProfile } = req;

  let user = await prisma.user.findUnique({
    where: { email: googleProfile.email, loginMethod: LOGIN_METHOD.google },
    include: {
      notification: true,
    },
  });

  if (!user) {
    const userModel = new User({
      ...googleProfile,
      loginMethod: LOGIN_METHOD.google,
      isVerified: true,
      verifiedAt: currentTime(),
    });

    const existingGoogleEmail = await userModel.checkIfGoogleEmailExists();

    if (existingGoogleEmail) {
      const failure = {
        existingGoogleEmail: true,
        success: false,
      };
      const failureQueryString = new URLSearchParams(failure).toString();
      return res.redirect(
        `${process.env.FRONT_END_ORIGIN}/auth/google?${failureQueryString}`
      );
    }

    await userModel.createUsername();
    await userModel.uploadGoogleProfileImage();
    userModel.createPreference();

    user = await prisma.user.create({
      data: userModel.model,
      include: {
        notification: true,
      },
    });
  }

  const tokenUser = createTokenUser(user);
  const token = getJWTToken(tokenUser);

  const success = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    token,
    success: true,
  };

  const successQueryString = new URLSearchParams(success).toString();

  res.redirect(
    `${process.env.FRONT_END_ORIGIN}/auth/google?${successQueryString}`
  );

  if (user.notification.loginAlert) {
    sendLoginAlertNotificationEmail({
      name: user.name,
      email: user.email,
    });
  }
};

module.exports = {
  register,
  verify,
  forgotPassword,
  resetPassword,
  login,
  googleLogin,
};
