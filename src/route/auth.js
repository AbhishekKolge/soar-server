const express = require("express");

const { registerSchema } = require("../validation");
const { validateRequest } = require("../middleware");
const { register } = require("../controller");

const authRouter = express.Router();

authRouter.route("/register").post([registerSchema, validateRequest], register);
// router
//   .route("/admin/register")
//   .post([registerSchema, validateRequest], adminRegister);
// router.route("/verify").post([verifySchema, validateRequest], verify);
// router
//   .route("/forgot-password")
//   .post([forgotPasswordSchema, validateRequest], forgotPassword);
// router
//   .route("/reset-password")
//   .post([resetPasswordSchema, validateRequest], resetPassword);
// router.route("/login").post([loginSchema, validateRequest], login);
// router.route("/admin/login").post([loginSchema, validateRequest], adminLogin);

module.exports = authRouter;
