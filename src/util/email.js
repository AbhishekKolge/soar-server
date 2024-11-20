const nodemailer = require("nodemailer");

const { nodeMailerConfig, isProductionEnv } = require("./config");
const { time, currentTime } = require("./time");
const { formatCurrency } = require("./number");

const sendEmail = async ({ to, subject, html }) => {
  if (!isProductionEnv) {
    return;
  }

  const transporter = nodemailer.createTransport(nodeMailerConfig);

  return transporter.sendMail({
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ID}>`,
    to,
    subject,
    html,
  });
};

const sendResetPasswordEmail = async ({ name, email, resetPasswordCode }) => {
  const message = `<p>Your password reset code is ${resetPasswordCode}</p>`;

  const html = `<h4>Hello, ${name}</h4> ${message}`;

  return sendEmail({
    to: email,
    subject: `${process.env.APP_NAME} Reset Password Code`,
    html,
  });
};

const sendVerificationEmail = async ({ name, email, verificationCode }) => {
  const message = `<p>Your email verification code is ${verificationCode}</p>`;

  const html = `<h4>Hello, ${name}</h4> ${message}`;

  return sendEmail({
    to: email,
    subject: `${process.env.APP_NAME} Email Confirmation Code`,
    html,
  });
};

const sendLoginAlertNotificationEmail = async ({ name, email }) => {
  const message = `<p>Your account has been logged in on ${time(
    currentTime()
  )}</p>`;

  const html = `<h4>Hello, ${name}</h4> ${message}`;

  return sendEmail({
    to: email,
    subject: `${process.env.APP_NAME} Login Alert`,
    html,
  });
};

const sendTransactionAlertEmail = async ({
  name,
  email,
  amount,
  balance,
  recipient,
}) => {
  const message = `<p>${formatCurrency(
    amount
  )} transferred to ${recipient} on ${time(
    currentTime()
  )}, current balance is ${formatCurrency(balance)}</p>`;

  const html = `<h4>Hello, ${name}</h4> ${message}`;

  return sendEmail({
    to: email,
    subject: `${process.env.APP_NAME} Transaction Alert`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendLoginAlertNotificationEmail,
  sendTransactionAlertEmail,
};
