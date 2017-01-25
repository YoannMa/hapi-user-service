'use strict';

const _        = require('lodash');
const fs       = require('fs');
const path     = require('path');
const routeDir = path.join(__dirname, '../../app/endpoints/');
const routes   = fs.readdirSync(routeDir);

module.exports = _.map(routes, (route) => {
    return {
        plugin : {
            register : path.join(routeDir, route),
            options  : {
                select : 'api'
            }
        }
    };
});
