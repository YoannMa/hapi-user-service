'use strict';

const Glue = require('glue');
const manifest = require('./config/manifest');

Glue.compose(manifest, { relativeTo : __dirname }, (err, server) => {
    if (err) {
        throw err;
    }
    
    server.start(() => {
        server.log([ 'info', 'startup' ], 'Server is listening on : ' + server.info.uri.toLowerCase());
        server.log([ 'info', 'startup' ], 'Environment Variable : ' + server.settings.app.env);
    });
});