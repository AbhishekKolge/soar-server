const Joi = require("joi");

const transferAmountSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    amount: Joi.string().trim().required(),
    pin: Joi.string().trim().min(6).max(6).required(),
  });

  req.schema = schema;

  next();
};

module.exports = {
  transferAmountSchema,
};
