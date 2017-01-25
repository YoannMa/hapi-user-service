'use strict';

const encrypt        = require('yoannma/iut-encrypt');
const jsonToMongoose = require('json-mongoose');
const mongoose       = require('k7-mongoose').mongoose;

module.exports = jsonToMongoose({
    mongoose    : mongoose,
    collection  : 'user',
    schema      : require('../schemas/user'),
    autoinc     : {
        field: '_id'
    },
    //pre         : {
    //    save: (doc, next) => {
    //        doc.password = encrypt.hash256(doc.password);
    //        next();
    //        //async.parallel({
    //        //    password : done => {
    //        //        bcrypt.hash(doc.password, 10, (err, hash) => {
    //        //            if (err) {
    //        //                return next(err);
    //        //            }
    //        //            doc.password = hash;
    //        //            done();
    //        //        });
    //        //    }
    //        //}, next);
    //    }
    //},
    schemaUpdate: (schema) => {
        //schema.login.unique = true;
        //schema.nir.unique   = true;
        
        return schema;
    },
    transform   : (doc, ret, options) => {
        //delete ret.password;
        
        return ret;
    },
    options     : {}
});