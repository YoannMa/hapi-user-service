'use strict';

const _ = require('lodash');
const casual = require('casual');

casual.define('nir', () => { return require('nir-generator').generateNir() });

casual.define('user', () => {
    let firstName = casual.first_name;
    let lastName = casual.last_name;
    let randomCase = string => {
        return _.map(string, char => {
            return casual.coin_flip ? char.toUpperCase() : char.toLowerCase();
        }).join('')
    };
    
    let email = casual.email.split('@');
    email = randomCase(email[0]) + '@' + email[1];
    
    return {
        login: randomCase(firstName+lastName),
        password: require('password-generator')(12, false),
        email: email,
        firstname: firstName,
        lastname: lastName,
        nir : casual.nir
    };
});


module.exports.findAll = (request, reply) => {
    request.server.database.user.find({}).then(data => {
        if ( data ) {
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
        if ( !user ) {
            reply.notFound('User not found', { id : request.params.id || null });
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
        reply(null, saved.toObject());
    }).catch(err => {
        if ( err.code === 11000 ) { // duplicate key
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
        if ( !data ) {
            reply.notFound('User not found', { id : request.params.id || null });
            return;
        }
        request.server.database.user.findOne({
            _id : request.params.id,
        }).then(user => {
            if ( !user ) {
                reply.notFound('User not found', { id : request.params.id || null });
                return;
            }
            reply(null, {
                before : data.toObject(),
                after  : user.toObject()
            });
        }).catch((err) => {
            reply.badImplementation(err, { id : request.params.id });
        });
    }).catch((err) => {
        reply.badImplementation(err, { id : request.params.id });
    });
};

module.exports.delete = (request, reply) => {
    request.server.database.user.findOneAndRemove({
        _id : request.params.id,
    }).then(data => {
        if ( !data ) {
            reply.notFound('User not found', { id : request.params.id || null });
            return;
        }
        reply(null, { id : request.params.id })
    }).catch((err) => {
        reply.badImplementation(err, { id : request.params.id });
    });
};

module.exports.inflate = (request, reply) => {
    Promise.all(_.map(_.range(request.params.number), () => {
        return (new request.server.database.user(casual.user)).save();
    })).then(users => {
        reply(null, _.map(users, user => user.toObject()));
    }).catch(err => {
        reply.badImplementation(err);
    });
};