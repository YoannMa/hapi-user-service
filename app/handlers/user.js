'use strict';

module.exports.create = (request, response) => {
    response(null,  {
        result : 'vous êtes connectés'
    });
};