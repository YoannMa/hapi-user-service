'use strict';

const async     = require('async');
const envConfig = require('../environments/all');

module.exports.init = server => {
    return new Promise((resolve, reject) => {
        async.series({
            good(done) {
                server.register({
                    register : require('good')
                }, done);
            },
            blipp(done) {
                server.register({
                    register : require('blipp'),
                    options  : {
                        showStart : envConfig.log.showRouteAtStart,
                        showAuth  : true
                    }
                }, done);
            },
            boom(done) {
                server.register({
                    register : require('hapi-boom-decorators')
                }, done);
            },
            inert(done) {
                server.register(require('inert'), done);
            },
            vision(done) {
                server.register(require('vision'), done);
            },
            swagger(done) {
                server.register({
                    register : require('hapi-swagger'),
                    options : {
                        info: {
                            'title': 'Test API Documentation',
                            'version': 1.0,
                        }
                    }
                }, done);
            }
        }, err => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
};