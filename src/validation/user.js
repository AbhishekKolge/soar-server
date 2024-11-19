const Joi = require("joi");
const { joiContactNo } = require("../util");

const uploadProfileImageSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

const removeProfileImageSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

const updateUserSchema = (req, res, next) => {
  const schema = Joi.object()
    .keys({
      name: Joi.string().trim().max(50).min(3).optional(),
      username: Joi.string().trim().max(50).min(3).optional(),
      dob: Joi.date().iso().allow(null).optional(),
      contactNumber: joiContactNo.string().phoneNumber().allow(null).optional(),
      contactCountryId: Joi.string().trim().allow(null).optional(),
      present: Joi.string().trim().max(200).min(3).allow(null).optional(),
      permanent: Joi.string().trim().max(200).min(3).allow(null).optional(),
      city: Joi.string().trim().max(50).min(3).allow(null).optional(),
      postalCode: Joi.string().trim().max(10).min(3).allow(null).optional(),
      countryId: Joi.string().trim().allow(null).optional(),
    })
    .when(Joi.object({ contactNumber: Joi.exist() }).unknown(), {
      then: Joi.object({
        contactCountryId: Joi.string().trim().required().messages({
          "any.required": "country code is required",
        }),
      }),
    })
    .when(Joi.object({ contactCountryId: Joi.exist() }).unknown(), {
      then: Joi.object({
        contactNumber: joiContactNo.string().phoneNumber().required().messages({
          "any.required": "contact number is required",
        }),
      }),
    });

  req.schema = schema;

  next();
};

const deleteUserSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

const updateSecuritySchema = (req, res, next) => {
  const schema = Joi.object().keys({
    twoFactorAuth: Joi.boolean().required(),
  });

  req.schema = schema;

  next();
};

const updatePreferenceSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    transactionAlert: Joi.boolean().required(),
    loginAlert: Joi.boolean().required(),
  });

  req.schema = schema;

  next();
};

module.exports = {
  uploadProfileImageSchema,
  removeProfileImageSchema,
  updateUserSchema,
  deleteUserSchema,
  updateSecuritySchema,
  updatePreferenceSchema,
};
