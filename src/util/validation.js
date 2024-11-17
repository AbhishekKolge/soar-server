const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);
const joiContactNo = Joi.extend(require("joi-phone-number"));

module.exports = {
  joiPassword,
  joiContactNo,
};
