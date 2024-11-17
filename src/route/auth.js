const express = require("express");

const {
  registerSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginSchema,
} = require("../validation");
const { validateRequest } = require("../middleware");
const {
  register,
  verify,
  forgotPassword,
  resetPassword,
  login,
  googleLogin,
} = require("../controller");
const { GOOGLE_SCOPE, passport, GOOGLE_SESSION } = require("../util");

const authRouter = express.Router();

authRouter.route("/register").post([registerSchema, validateRequest], register);
authRouter.route("/verify").post([verifySchema, validateRequest], verify);
authRouter
  .route("/forgot-password")
  .post([forgotPasswordSchema, validateRequest], forgotPassword);
authRouter
  .route("/reset-password")
  .post([resetPasswordSchema, validateRequest], resetPassword);
authRouter.route("/login").post([loginSchema, validateRequest], login);
authRouter
  .route("/google")
  .get(passport.authenticate("google", { scope: GOOGLE_SCOPE }));
authRouter
  .route("/google/callback")
  .get(
    passport.authenticate("google", { session: GOOGLE_SESSION }),
    googleLogin
  );

module.exports = authRouter;
