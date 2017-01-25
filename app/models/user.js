'use strict';

const encrypt        = require('@yoannma/iut-encrypt');
const jsonToMongoose = require('json-mongoose');
const mongoose       = require('k7-mongoose').mongoose();

module.exports = jsonToMongoose({
    mongoose     : mongoose,
    collection   : 'user',
    schema       : require('../schemas/user').base,
    autoinc      : {
        field : '_id'
    },
    pre          : {
        save : (doc, next) => {
            doc.password = encrypt.hash256(doc.password);
            next();
        }
    },
    schemaUpdate : (schema) => {
        schema.login.unique = true;
        schema.email.unique = true;
        schema.nir.unique   = true;
        
        return schema;
    },
    transform    : (doc, ret, options) => {
        ret.id = ret._id;
        delete ret.password;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
    options      : {}
});