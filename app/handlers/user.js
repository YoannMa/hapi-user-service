'use strict';

const _                                  = require('lodash');
const async                              = require('async');
const casual                             = require('casual');
const encrypt                            = require('@yoannma/iut-encrypt');
const sendEmailKeysDiffConditionOnUpdate = [ 'login', 'password' ];

casual.define('nir', () => { return require('nir-generator').generateNir(); });
casual.define('user', () => {
    let firstName  = casual.first_name;
    let lastName   = casual.last_name;
    let randomCase = string => {
        return _.map(string, char => {
            return casual.coin_flip ? char.toUpperCase() : char.toLowerCase();
        }).join('');
    };
    
    let email = casual.email.split('@');
    
    email = randomCase(email[ 0 ]) + '@' + email[ 1 ];
    
    return {
        login     : randomCase(firstName + lastName),
        password  : require('password-generator')(12, false),
        email     : email,
        firstname : firstName,
        lastname  : lastName,
        nir       : casual.nir
    };
});

module.exports.authenticateUser = (request, reply) => {
    request.server.database.user.findOne({
        login    : request.payload.login,
        password : encrypt.hash256(request.payload.password)
    }).then(user => {
        if (!user) {
            reply(null, { msg : 'ko' }).code(401);
            return;
        }
        reply(null, { msg : 'ok' });
    }).catch(err => {
        reply.badImplementation(err.message);
    });
};

module.exports.findAll = (request, reply) => {
    request.server.database.user.find({}).then(data => {
        if (data) {
            reply(null, data.map(user => user.toObject()));
            return;
        }
        reply(null, []);
    }).catch(err => {
        reply.badImplementation(err.message);
    });
};

module.exports.findOneById = (request, reply) => {
    request.server.database.user.findOne({
        _id : request.params.id || null
    }).then(user => {
        if (!user) {
            reply.notFound('User not found', { id : request.params.id });
            return;
        }
        reply(null, user.toObject());
    }).catch(err => {
        reply.badImplementation(err.message, { id : request.params.id });
    });
};

module.exports.create = (request, reply) => {
    let model = new request.server.database.user(request.payload);
    
    model.save().then((saved) => {
        let user = saved.toObject();
        
        request.server.mailer.sendCreationDataInfo(_.extend(user, { password : request.payload.password })).catch((err) => {
            if (err) {
                request.server.log('error', `${ err.message } : Couldn\'t send the mail to the user ${ JSON.stringify(user) }`);
            }
        });
        reply(null, user);
    }).catch(err => {
        if (err.code === 11000) { // duplicate key
            reply.preconditionFailed(err.message);
            return;
        }
        reply.badImplementation(err.message, { user : request.payload });
    });
};

module.exports.update = (request, reply) => {
    request.server.database.user.findOneAndUpdate({
        _id : request.params.id,
    }, request.payload).then(data => {
        if (!data) {
            reply.notFound('User not found', { id : request.params.id });
            return;
        }
        request.server.database.user.findOne({
            _id : request.params.id,
        }).then(user => {
            if (!user) {
                reply.notFound('User not found', { id : request.params.id });
                return;
            }
            let diff = {
                before : data.toObject(),
                after  : user.toObject()
            };
            
            if (!_.isEqual(_.pick(data, sendEmailKeysDiffConditionOnUpdate), _.pick(user, sendEmailKeysDiffConditionOnUpdate))) {
                request.server.mailer.sendUpdatedDataInfo(diff.after).catch((err) => {
                    if (err) {
                        request.server.log('error', `${ err.message } : Couldn\'t send the mail to the user ${ JSON.stringify(user) }`);
                    }
                });
            }
            reply(null, diff);
        }).catch((err) => {
            reply.badImplementation(err, { id : request.params.id });
        });
    }).catch((err) => {
        reply.badImplementation(err, { id : request.params.id });
    });
};

module.exports.changePassword = (request, reply) => {
    let newPassword = require('password-generator')(12, false);
    
    request.server.database.user.findOneAndUpdate({
        email : request.params.email,
    }, { password : encrypt.hash256(newPassword) }).then(data => {
        if (!data) {
            reply.notFound('User not found', { email : request.params.email });
            return;
        }
        
        let user = data.toObject();
        
        request.server.mailer.sendNewPasswordInfo(_.assignIn(user, { password : newPassword })).catch((err) => {
            if (err) {
                request.server.log('error', `${ err.message } : Couldn\'t send the mail to the user ${ JSON.stringify(user) }`);
            }
        });
        reply(null, { msg : 'ok' });
    }).catch((err) => {
        reply.badImplementation(err, { id : request.params.id });
    });
};

module.exports.delete = (request, reply) => {
    request.server.database.user.findOneAndRemove({
        _id : request.params.id,
    }).then(data => {
        if (!data) {
            reply.notFound('User not found', { id : request.params.id });
            return;
        }
        reply(null, { id : request.params.id })
    }).catch((err) => {
        reply.badImplementation(err, { id : request.params.id });
    });
};

module.exports.inflate = (request, reply) => {
    async.mapLimit(_.range(request.params.number), 20, (number, callback) => {
        let userInfo = casual.user;
        let user     = new request.server.database.user(userInfo);
        
        user.save().then((saved) => {
            request.server.mailer.sendCreationDataInfo(userInfo).catch(err => {
                if (err) {
                    request.server.log('error', `${ err.message } : Couldn\'t send the mail to the user ${ JSON.stringify(userInfo) }`, userInfo);
                }
            });
            callback(null, saved.toObject());
        }).catch(err => {
            callback(err);
        });
    }, (err, users) => {
        if (err) {
            reply.badImplementation(err);
            return;
        }
        reply(null, users);
    });
    //Promise.all(async.map(_.range(request.params.number), () => {
    //    return (new request.server.database.user(casual.user)).save();
    //})).then(users => {
    //    reply(null, _.map(users, user => user.toObject()));
    //}).catch(err => {
    //    reply.badImplementation(err);
    //});
};