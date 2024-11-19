const express = require("express");

const {
  uploadProfileImageSchema,
  removeProfileImageSchema,
  updateUserSchema,
  deleteUserSchema,
  updateSecuritySchema,
  updatePreferenceSchema,
} = require("../validation");
const { validateRequest, testUser } = require("../middleware");
const { authenticateUser } = require("../middleware");
const {
  showCurrentUser,
  uploadProfileImage,
  removeProfileImage,
  updateUser,
  deleteUser,
  updateSecurity,
  getSecurity,
  updatePreference,
  getPreference,
} = require("../controller");

const userRouter = express.Router();

userRouter.route("/show-me").get(authenticateUser, showCurrentUser);
userRouter
  .route("/profile-image")
  .post(
    [authenticateUser, uploadProfileImageSchema, validateRequest],
    uploadProfileImage
  )
  .delete(
    [authenticateUser, removeProfileImageSchema, validateRequest],
    removeProfileImage
  );
userRouter
  .route("/")
  .patch([authenticateUser, updateUserSchema, validateRequest], updateUser)
  .delete(
    [authenticateUser, testUser, deleteUserSchema, validateRequest],
    deleteUser
  );
userRouter
  .route("/security")
  .get(authenticateUser, getSecurity)
  .patch(
    [authenticateUser, updateSecuritySchema, validateRequest],
    updateSecurity
  );
userRouter
  .route("/preference")
  .get(authenticateUser, getPreference)
  .patch(
    [authenticateUser, updatePreferenceSchema, validateRequest],
    updatePreference
  );

module.exports = userRouter;
