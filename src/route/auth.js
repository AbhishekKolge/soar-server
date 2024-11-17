const express = require("express");

const { registerSchema, verifySchema } = require("../validation");
const { validateRequest } = require("../middleware");
const { register, verify } = require("../controller");

const authRouter = express.Router();

authRouter.route("/register").post([registerSchema, validateRequest], register);
authRouter.route("/verify").post([verifySchema, validateRequest], verify);
// router
//   .route("/forgot-password")
//   .post([forgotPasswordSchema, validateRequest], forgotPassword);
// router
//   .route("/reset-password")
//   .post([resetPasswordSchema, validateRequest], resetPassword);
// router.route("/login").post([loginSchema, validateRequest], login);
// router.route("/admin/login").post([loginSchema, validateRequest], adminLogin);

module.exports = authRouter;
