'use strict';

const handler = require('../handlers/user');
const Joi = require('joi');
const user = require('../schemas/user');

module.exports.register = (server, options, next) => {
    server.route(
        [
            {
                method : 'PUT',
                path   : '/user',
                config : {
                    description : 'Créer un utilisateur en suivant un schéma Swagger',
                    tags        : [ 'api' ],
                    plugins     : {
                        'hapi-swagger' : {
                            responses : {
                                201 : {
                                    description : 'user created with success',
                                    schema      : user.fullWithoutPassword
                                }
                            }
                        }
                    },
                    handler     : handler.create,
                    validate    : {
                        payload : require('../schemas/user').base
                    },
                    response    : {
                        status : {
                            201 : require('../schemas/user').fullWithoutPassword
                        }
                    }
                }
            },
            {
                method : 'GET',
                path   : '/user',
                config : {
                    description : 'Récupère tout les utilisateurs',
                    tags        : [ 'api' ],
                    handler     : handler.findAll,
                    response    : {
                        status : {
                            201 : Joi.array().items(user.fullWithoutPassword)
                        }
                    }
                }
            },
            {
                method : 'GET',
                path   : '/user/{id}',
                config : {
                    description : 'Récupère l\'utilisateur lié à un identifiant',
                    tags        : [ 'api' ],
                    handler     : handler.findOneById,
                    response    : {
                        status : {
                            200 : user.fullWithoutPassword
                        }
                    },
                    plugins     : {
                        'hapi-swagger' : {
                            responses : {
                                200 : {
                                    description : 'utilisateur correspondant à l\'ID',
                                    schema      : user.fullWithoutPassword
                                }
                            }
                        }
                    },
                    validate    : {
                        params : {
                            id : require('../schemas/user').id
                        }
                    }
                }
            },
            {
                method : 'PATCH',
                path   : '/user/{id}',
                config : {
                    description : 'Met à jour un utilisateur',
                    tags        : [ 'api' ],
                    handler     : handler.update,
                    plugins     : {
                        'hapi-swagger' : {
                            responses : {
                                202 : {
                                    description : 'utilisateur mis à jour avec succés',
                                    schema      : Joi.object({
                                        before : user.full,
                                        after  : user.full
                                    })
                                }
                            }
                        }
                    },
                    validate    : {
                        params  : {
                            id : user.id
                        },
                        payload : user.base
                    },
                    response    : {
                        status : {
                            202 : Joi.object({
                                before : user.full,
                                after  : user.full
                            })
                        }
                    }
                }
            },
            {
                method : 'DELETE',
                path   : '/user/{id}',
                config : {
                    description : 'Supprime un utilisateur',
                    tags        : [ 'api' ],
                    handler     : handler.delete,
                    plugins     : {
                        'hapi-swagger' : {
                            responses : {
                                202 : {
                                    description : 'utilisateur supprimé avec succés',
                                    schema      : Joi.object({
                                        id : user.id
                                    }).label('id')
                                }
                            }
                        }
                    },
                    validate    : {
                        params : {
                            id : user.id
                        }
                    },
                    response    : {
                        status : {
                            202 : Joi.object({
                                id : user.id
                            }).label('id')
                        }
                    }
                }
            }
        ]
    );
    next();
};

module.exports.register.attributes = {
    name : 'default-routes'
};