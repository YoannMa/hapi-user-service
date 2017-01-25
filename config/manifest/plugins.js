'use strict';

const envConfig = require('../environments/all');
const path      = require('path');
const Pack      = require('../../package.json');

module.exports = [
    {
        plugin: {
            register: 'good',
            options : envConfig.log.goodConfig
        }
    },
    {
        plugin: {
            register: 'blipp',
            options : {
                showStart: envConfig.log.showRouteAtStart,
                showAuth : true
            }
        }
    },
    {
        plugin: {
            register: 'inert',
            options : {}
        }
    },
    {
        plugin: {
            register: 'vision',
            options : {}
        }
    },
    {
        plugin: {
            register: 'hapi-boom-decorators',
            options : {}
        }
    },
    {
        plugin: {
            register: 'hapi-swagger',
            options : {
                info             : {
                    title  : 'Test API Documentation',
                    version: Pack.version
                },
                documentationPage: envConfig.swagger.documentation,
                jsonEditor       : true
            }
        }
    },
    {
        plugin: {
            register: path.join(__dirname, '../../app', '/handlers')
        }
    }
];