const Joi = require('joi');
const _   = require('lodash');

const id = Joi.number().integer().min(0).example(1506).required();

const base = {
    login     : Joi.string().alphanum().min(3).max(30).required().example('johndoe18'),
    password  : Joi.string().min(8).required().example('myFuckingPassWord'),
    firstname : Joi.string().required().example('John'),
    lastname  : Joi.string().required().example('Doe'),
    company   : Joi.string().example('A tech company'),
    fonction  : Joi.string().example('CTO'),
    email     : Joi.string().email().example('johndoe@tech-company.com'),
    nir       : Joi.string()
        .length(15)
        .example('196012432212162')
        .regex(/^([1-3])[\s.\-]?([0-9]{2})[\s.\-]?(0[0-9]|[2-35-9][0-9]|[14][0-2])[\s.\-]?(0[1-9]|[1-8][0-9]|9[0-57-9]|2[ab])[\s.\-]?(00[1-9]|0[1-9][0-9]|[1-8][0-9]{2}|9[0-8][0-9]|990)[\s.\-]?([0-9]{3})[\s.\-]?([0-8][0-9]|9[0-7])$/gi, { name : 'NIR pattern' })
};


const serverSide = {
    createdAt : Joi.date().iso(),
    updatedAt : Joi.date().iso(),
};

module.exports = {
    id                  : id,
    base                : Joi.object().keys(base),
    fullWithoutPassword : Joi.object().keys(_.omit(_.extend(base, serverSide, { id }), 'password')),
    full                : Joi.object().keys(_.extend(base, serverSide, { id }))
};

