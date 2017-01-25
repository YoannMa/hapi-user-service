'use strict';

const handler = require('../handlers/user');

module.exports.register = (server, options, next) => {
    server.route(
        [
            {
                method: 'POST',
                path  : '/user',
                config: {
                    description: 'Créer un utilisateur en suivant un schéma Swagger',
                    tags       : [ 'api' ],
                    plugins    : {
                        'hapi-swagger': {
                            responses  : {
                                201: {
                                    description: 'user created with success',
                                    schema     : require('../schemas/user')
                                }
                            }
                        }
                    },
                    handler    : handler.create,
                    validate   : {
                        payload: require('../schemas/user')
                    },
                    response   : {
                        status: {
                            201: require('../schemas/user')
                        }
                    }
                }
            },
            {
                method: 'GET',
                path  : '/users',
                config: {
                    description: 'Récupère tout les utilisateurs',
                    tags       : [ 'api' ],
                    handler    : handler.gets,
                    response   : {
                        status: {
                            201: require('../schemas/user')
                        }
                    }
                }
            }
        ]
    );
    next();
};

module.exports.register.attributes = {
    name: 'default-routes'
};