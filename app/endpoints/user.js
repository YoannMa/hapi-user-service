'use strict';

const handler = require('../handlers/user');

exports.register = (server, options, next) => {
    server.route([
        {
            method : 'POST',
            path   : '/user',
            config : {
                description : 'Créer un utilisateur en suivant un schéma Swagger',
                notes       : 'Route par défaut du projet',
                tags        : [ 'api' ],
                handler     : handler.create,
                validate : {
                    payload : require('../schemas/user')
                }
            }
        }
    ]);
    next();
};

exports.register.attributes = {
    name : 'default-routes'
};