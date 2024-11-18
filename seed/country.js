const fs = require("fs");
const csv = require("csv-parser");

const prisma = require("../prisma/prisma-client");

const filePath = "data/country.csv";

const countryCache = {};

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", async (row) => {
    try {
      const name = row[Object.keys(row)[0]].trim();
      const shortName = row.A2.trim();
      const phoneCode = row.dialCode.trim();
      if (name && shortName && phoneCode) {
        let country = countryCache[shortName];

        if (!country) {
          country = await prisma.country.findUnique({
            where: { shortName },
          });

          if (!country) {
            country = await prisma.country.create({
              data: { name, shortName, phoneCode },
            });
            countryCache[shortName] = shortName;
          } else {
            countryCache[shortName] = shortName;
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  })
  .on("end", () => {
    console.log("Country seeding completed");
  });
