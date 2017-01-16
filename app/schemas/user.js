export default require('joi').object().keys({
    login     : Joi.string().alphanum().min(3).max(30).required().example('johndoe18'),
    password  : Joi.string().min(8).required().example('myFuckingPassWord'),
    firstname : Joi.string().required().example('John'),
    lastname  : Joi.number().required().example('Doe'),
    company   : Joi.number().example('A tech company'),
    function  : Joi.number().example('CTO'),
    email     : Joi.string().email().example('johndoe@tech-company.com'),
    nir       : Joi.string().length(15).example('196012432212162')
});