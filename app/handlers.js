'use strict';

const Plugo = require('plugo');

exports.register = (plugin, options, next) => {
    const plugoptions = {
        name : 'handlers',
        path : __dirname + '/handlers'
    };
    
    // Exposes modules in the handlers folder to this plugin
    Plugo.expose(plugoptions, plugin, next);
};

exports.register.attributes = {
    name : 'controllers'
};
