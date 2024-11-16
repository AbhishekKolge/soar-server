const bcrypt = require("bcryptjs");
const validator = require("validator");
const { checkTimeExpired, hashString } = require("../util");
const {
  UnauthenticatedError,
  ConflictError,
  BadRequestError,
  UnauthorizedError,
} = require("../error");

class User {
  constructor(model) {
    this.model = model;
  }

  compareVerificationCode(code) {
    const isMatch = this.model.verificationCode === hashString(code);

    if (!isMatch) throw new UnauthenticatedError("Verification failed");
  }

  checkVerificationCodeValidity() {
    const isExpired = checkTimeExpired(this.model.verificationCodeExpiration);

    if (!isExpired && this.model.verificationCode) {
      throw new ConflictError("Verification code already sent");
    }
  }

  checkResetPasswordCodeValidity() {
    const isExpired = checkTimeExpired(this.model.resetPasswordCodeExpiration);

    if (!isExpired && this.model.resetPasswordCode) {
      throw new ConflictError("Password reset code already sent");
    }
  }

  verifyResetPasswordCode(resetPasswordCode) {
    if (
      !this.model.resetPasswordCodeExpiration ||
      !this.model.resetPasswordCode
    ) {
      throw new UnauthenticatedError("Please generate forgot password code");
    }
    const isExpired = checkTimeExpired(this.model.resetPasswordCodeExpiration);

    if (isExpired) {
      throw new UnauthenticatedError("Password reset code has expired");
    }

    const isMatch =
      this.model.resetPasswordCode === hashString(resetPasswordCode);

    if (!isMatch) {
      throw new UnauthenticatedError("Verification failed");
    }
  }

  async comparePassword(password) {
    const isMatch = await bcrypt.compare(password, this.model.password);
    if (!isMatch) {
      throw new UnauthenticatedError("Please provide valid credentials");
    }
  }

  async encryptPassword() {
    const isPasswordStrong = validator.isStrongPassword(this.model.password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });

    if (!isPasswordStrong) {
      throw new BadRequestError("Please provide strong password");
    }

    const salt = await bcrypt.genSalt(10);
    this.model.password = await bcrypt.hash(this.model.password, salt);

    return this.model;
  }

  checkAuthorized() {
    if (!this.model.isVerified) {
      throw new UnauthorizedError("Please verify your email");
    }
  }

  createPreference() {
    this.model = {
      ...this.model,
      address: {
        create: {},
      },
      notification: {
        create: {},
      },
      security: {
        create: {},
      },
    };

    return this.model;
  }
}

module.exports = User;
