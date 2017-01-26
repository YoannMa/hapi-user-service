'use strict';

const _ = require('lodash');

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
