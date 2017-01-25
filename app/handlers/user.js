'use strict';

const _    = require('lodash');
const Boom = require('boom');


module.exports.gets = (request, reply) => {
    request.server.database.user.find({}).then(
        data => {
            if ( !data ) {
                // todo
            }
            reply(data);
        }
    );
};

module.exports.create = (request, reply) => {
    
    let model = new request.server.database.user();
    
    model.set(request.payload);
    
    model.save().then(
        (saved) => {
            let response = saved.toObject();
            response.id  = response._id;
            reply(_.omit(response, [ '__v', '_id', 'createdAt', 'updatedAt' ]));
        }
    ).catch(
        (err) => {
            reply(Boom.wrap(err));
        }
    );
};