'use strict';

const handler        = require('../handlers/user');
const Joi            = require('joi');
const user           = require('../schemas/user');
const quickResponses = require('../schemas/quickResponses');

module.exports.register = (server, options, next) => {
    server.route(
        [
            {
                method : 'POST',
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
                method : 'POST',
                path   : '/user/inflate/{number}',
                config : {
                    description : 'Génére X user',
                    tags        : [ 'api' ],
                    handler     : handler.inflate,
                    response    : {
                        status : {
                            200 : Joi.array().items(user.fullWithoutPassword)
                        }
                    },
                    plugins     : {
                        'hapi-swagger' : {
                            responses : {
                                200 : {
                                    description : 'utilisateurs générés',
                                    schema      : Joi.array().items(user.fullWithoutPassword)
                                }
                            }
                        }
                    },
                    validate    : {
                        params : {
                            number : Joi.number().integer().min(1).max(500).required()
                        }
                    }
                }
            },
            {
                method : 'POST',
                path   : '/user/reset/{email}',
                config : {
                    description : 'Regénère un mot de passe pour l\'user',
                    tags        : [ 'api' ],
                    handler     : handler.changePassword,
                    response    : {
                        status : {
                            200 : quickResponses.ok
                        }
                    },
                    plugins     : {
                        'hapi-swagger' : {
                            responses : {
                                200 : {
                                    description : 'mot de passe regénéré',
                                    schema      : quickResponses.ok
                                }
                            }
                        }
                    },
                    validate    : {
                        params : {
                            login : user.baseRaw.email
                        }
                    }
                }
            },
            {
                method : 'POST',
                path   : '/user/authent',
                config : {
                    description : 'Authentifie un utilisateur',
                    tags        : [ 'api' ],
                    handler     : handler.authenticateUser,
                    response    : {
                        status : {
                            200 : quickResponses.ok,
                            401 : quickResponses.ko
                        }
                    },
                    plugins     : {
                        'hapi-swagger' : {
                            responses : {
                                200 : {
                                    description : 'utilisateurs authentifié',
                                    schema      : quickResponses.ok
                                },
                                401 : {
                                    description : 'utilisateurs non authentifié',
                                    schema      : quickResponses.ko
                                }
                            }
                        }
                    },
                    validate    : {
                        payload : require('../schemas/user').authentication
                    },
                }
            },
            {
                method : 'PUT',
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
                                before : user.fullWithoutPassword,
                                after  : user.fullWithoutPassword
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
                                204 : {
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
    name : 'user-routes'
};