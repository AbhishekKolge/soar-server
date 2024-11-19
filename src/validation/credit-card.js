const Joi = require("joi");

const addCreditCardSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    number: Joi.string().trim().min(16).max(16).required(),
    name: Joi.string().trim().max(50).min(3).required(),
    isSelected: Joi.boolean().required(),
    validity: Joi.date().iso().required(),
    pin: Joi.string().trim().min(6).max(6).required(),
  });

  req.schema = schema;

  next();
};

const updateCreditCardSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().trim().max(50).min(3).optional(),
    isSelected: Joi.boolean().optional(),
    pin: Joi.string().trim().min(6).max(6).optional(),
  });

  req.schema = schema;

  next();
};

const deleteCreditCardSchema = (req, res, next) => {
  const schema = Joi.object().keys({});

  req.schema = schema;

  next();
};

module.exports = {
  addCreditCardSchema,
  updateCreditCardSchema,
  deleteCreditCardSchema,
};
