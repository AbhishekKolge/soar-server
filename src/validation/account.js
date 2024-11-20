const Joi = require("joi");

const addAccountSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    number: Joi.string().trim().min(16).max(16).required(),
    name: Joi.string().trim().max(50).min(3).required(),
    identity: Joi.string().trim().max(50).min(3).allow(null).optional(),
    bankId: Joi.string().trim().required(),
  });

  req.schema = schema;

  next();
};

const updateAccountSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    imageUrl: Joi.string().trim().allow(null).optional(),
    number: Joi.string().trim().min(16).max(16).optional(),
    name: Joi.string().trim().max(50).min(3).optional(),
    identity: Joi.string().trim().max(50).min(3).allow(null).optional(),
    bankId: Joi.string().trim().optional(),
  });

  req.schema = schema;

  next();
};

const deleteAccountSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

module.exports = {
  addAccountSchema,
  updateAccountSchema,
  deleteAccountSchema,
};
