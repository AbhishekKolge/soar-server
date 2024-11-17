const { StatusCodes } = require("http-status-codes");

const prisma = require("../../prisma/prisma-client");

const {
  createRandomOtp,
  sendVerificationEmail,
  LOGIN_METHOD,
  getVerificationTimeOffset,
  currentTime,
  hashString,
} = require("../util");
const { User } = require("../model");
const { UnauthenticatedError, BadRequestError } = require("../error");

const register = async (req, res) => {
  const verificationCode = createRandomOtp();
  console.log({ verificationCode });

  const userModel = new User({
    ...req.body,
    verificationCode: hashString(verificationCode),
    verificationCodeExpiration: getVerificationTimeOffset(),
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

module.exports = { register, verify };
