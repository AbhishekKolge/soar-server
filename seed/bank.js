const fs = require("fs");
const csv = require("csv-parser");

const prisma = require("../prisma/prisma-client");

const filePath = "data/bank.csv";

const bankCache = {};

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", async (row) => {
    try {
      const name = row[Object.keys(row)[0]].trim();

      if (name) {
        let bank = bankCache[name];
        if (!bank) {
          bank = await prisma.bank.findUnique({
            where: { name },
          });
          if (!bank) {
            bank = await prisma.bank.create({
              data: { name },
            });
            bankCache[name] = name;
          } else {
            bankCache[name] = name;
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  })
  .on("end", () => {
    console.log("Bank seeding completed");
  });
