'use strict';

const path      = require('path');
const envConfig = require('../environments/all');
const modelsDir = path.join(__dirname, '../../app/models/');

module.exports = [
    {
        plugin : {
            register : 'k7',
            options  : {
                connectionString : envConfig.databases.hapi.connection,
                adapter          : require(envConfig.databases.hapi.adapter),
                models           : [ path.join(modelsDir, '**/*.js') ]
            }
        }
    }
];
