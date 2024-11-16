const prisma = require("../../prisma/prisma-client");

const shutdown = async () => {
  try {
    console.log("Shutting down server...");
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.log(`Error occurred during server shutdown: ${error.message}`);
  }
};

const start = async (app) => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(`Server could not start with error: ${error.message}`);
  }
};

module.exports = { shutdown, start };
