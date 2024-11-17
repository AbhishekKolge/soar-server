const nodeMailerConfig = {
  host: process.env.SENDGRID_HOST,
  port: process.env.SENDGRID_PORT,
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_API_KEY,
  },
};
const isProductionEnv = process.env.NODE_ENV === "production";

module.exports = { nodeMailerConfig, isProductionEnv };
