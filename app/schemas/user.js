const Joi = require('joi');

module.exports = Joi.object({
    login    : Joi.string().alphanum().min(3).max(30).required().example('johndoe18'),
    password : Joi.string().min(8).required().example('myFuckingPassWord'),
    firstname: Joi.string().required().example('John'),
    lastname : Joi.string().required().example('Doe'),
    company  : Joi.string().optional().example('A tech company'),
    fonction : Joi.string().optional().example('CTO'),
    email    : Joi.string().email().optional().example('johndoe@tech-company.com'),
    nir      : Joi.string().optional().length(15).example('196012432212162')
});

//module.exports = Joi.object({
//    firstName       : Joi.string().required(),
//    lastName        : Joi.string().required(),
//    age             : Joi.number().integer(),
//    emailAddress    : Joi.string().email().required(),
//    login           : Joi.string().required(),
//    password        : Joi.string().required()
//});