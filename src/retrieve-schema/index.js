const countries = {
  id: true,
  name: true,
  shortName: true,
  phoneCode: true,
};

const banks = {
  id: true,
  name: true,
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
  pin: true,
  balance: {
    select: {
      amount: true,
    },
  },
};

const transaction = {
  id: true,
  method: true,
  amount: true,
  createdAt: true,
  recipient: true,
  note: true,
  category: true,
};

const account = {
  id: true,
  number: true,
  imageUrl: true,
  imageId: true,
  name: true,
  identity: true,
  bank: {
    select: banks,
  },
};

module.exports = {
  countries,
  user,
  security,
  preference,
  creditCard,
  transaction,
  banks,
  account,
};
