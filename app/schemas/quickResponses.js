const Joi = require('joi');

module.exports = {
    ok : Joi.object({ msg : Joi.string().required().only('ok') }),
    ko : Joi.object({ msg : Joi.string().required().only('ko') })
};