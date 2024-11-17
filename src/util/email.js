const nodemailer = require("nodemailer");

const { nodeMailerConfig, isProductionEnv } = require("./config");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodeMailerConfig);

  return transporter.sendMail({
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ID}>`,
    to,
    subject,
    html,
  });
};

const sendResetPasswordEmail = async ({ name, email, passwordCode }) => {
  if (!isProductionEnv) {
    return;
  }

  const message = `<p>Your password reset code is ${passwordCode}</p>`;

  const html = `<h4>Hello, ${name}</h4> ${message}`;

  return sendEmail({
    to: email,
    subject: `${process.env.APP_NAME} Reset Password Code`,
    html,
  });
};

const sendVerificationEmail = async ({ name, email, verificationCode }) => {
  if (!isProductionEnv) {
    return;
  }

  const message = `<p>Your email verification code is ${verificationCode}</p>`;

  const html = `<h4>Hello, ${name}</h4> ${message}`;

  return sendEmail({
    to: email,
    subject: `${process.env.APP_NAME} Email Confirmation Code`,
    html,
  });
};

module.exports = { sendEmail, sendResetPasswordEmail, sendVerificationEmail };
