'use strict';

const envConfig = require('../environments/all');

module.exports = {
    server      : {
        app : { // toutes les variables stockées ici sont récupérables dans server.settings.app
            envs : envConfig,
            env  : process.env.NODE_ENV || 'development'
        }
    },
    connections : [ envConfig.connections.api ]
};