const Joi = require("joi");
const { joiContactNo, joiPassword } = require("../util");

const registerSchema = (req, res, next) => {
  const schema = Joi.object()
    .keys({
      name: Joi.string().trim().max(50).min(3).required(),
      username: Joi.string().trim().max(50).min(3).required(),
      email: Joi.string().trim().email().required(),
      password: joiPassword
        .string()
        .trim()
        .max(50)
        .min(8)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfSpecialCharacters(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required(),
      dob: Joi.date().iso().allow(null).optional(),
      contactNumber: joiContactNo.string().phoneNumber().allow(null).optional(),
      contactCountryId: Joi.string().trim().allow(null).optional(),
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
        contactNumber: joiContactNo.string().phoneNumber().required(),
      }),
    });

  req.schema = schema;

  next();
};

const verifySchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    code: Joi.string().trim().required(),
  });

  req.schema = schema;

  next();
};

const forgotPasswordSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
  });

  req.schema = schema;

  next();
};

const resetPasswordSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    code: Joi.string().trim().required(),
    password: joiPassword
      .string()
      .trim()
      .max(50)
      .min(8)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfSpecialCharacters(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  });

  req.schema = schema;

  next();
};

const loginSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: joiPassword
      .string()
      .trim()
      .max(50)
      .min(8)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfSpecialCharacters(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
  });

  req.schema = schema;

  next();
};

module.exports = {
  registerSchema,
  verifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  loginSchema,
};
