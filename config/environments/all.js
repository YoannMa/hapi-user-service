'use strict';

const _           = require('lodash');
const env         = require('./' + (process.env.NODE_ENV || 'development'));
const packageJson = require('../../package.json');

const all = {
    swagger     : {
        documentation : true // use /documentation to get the swagger doc
    },
    connections : {
        api : {
            host   : '0.0.0.0',
            port   : process.env.PORT || 8080,
            labels : [ 'api' ],
            router : {
                stripTrailingSlash : true,
            },
            routes : {
                cors               : true,
                security           : true
            }
        }
    },
    log         : {
        goodConfig : {
            ops       : false,
            reporters : {
                console : [
                    {
                        module : 'good-console',
                        args   : [
                            {
                                format : '' // data format (empty to use ISO format)
                            }
                        ]
                    }, 'stdout'
                ]
            }
        }
    },
    databases   : {
        hapi : {   // vous pouvez le remplacer par le nom de votre propre base, c'est juste pour la retrouver facilement
            adapter    : 'k7-mongoose',
            connection : 'mongodb://localhost:27017/hapi'
        }
    }
};

module.exports = _.merge(all, env);
