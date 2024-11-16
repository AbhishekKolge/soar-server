const { StatusCodes } = require("http-status-codes");

const prisma = require("../../prisma/prisma-client");

const {
  createRandomOtp,
  sendVerificationEmail,
  LOGIN_METHOD,
  VERIFICATION_CODE_EXPIRATION_TIME,
} = require("../util");
const { User } = require("../model");

const register = async (req, res) => {
  const verificationCode = createRandomOtp();
  console.log({ verificationCode });

  const userModel = new User({
    ...req.body,
    verificationCode,
    verificationCodeExpiration: VERIFICATION_CODE_EXPIRATION_TIME,
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

module.exports = { register };
