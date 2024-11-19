const { balance, transaction } = require("../../prisma/prisma-client");

const countries = {
  id: true,
  name: true,
  shortName: true,
  phoneCode: true,
};

const user = {
  id: true,
  name: true,
  username: true,
  email: true,
  dob: true,
  contactNumber: true,
  contactCountryId: true,
  loginMethod: true,
  profileImageUrl: true,
  profileImageId: true,
  isVerified: true,
  verifiedAt: true,
  address: {
    select: {
      id: true,
      present: true,
      permanent: true,
      city: true,
      postalCode: true,
      countryId: true,
    },
  },
};

const security = {
  twoFactorAuth: true,
};

const preference = {
  transactionAlert: true,
  loginAlert: true,
};

const creditCard = {
  id: true,
  number: true,
  name: true,
  isSelected: true,
  validity: true,
  balance: {
    select: {
      amount: true,
    },
  },
};

module.exports = { countries, user, security, preference, creditCard };
