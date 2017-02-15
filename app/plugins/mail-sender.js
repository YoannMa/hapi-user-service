'use strict';

const io    = require('socket.io-client');
const _ = require('lodash');

const mailer = {
    _callMailService      : (namespace, context) => {
        return new Promise((resolve, reject) => {
            mailer._socket.emit(namespace, context, (res) => {
                if (!res || res.msg === 'ko') {
                    reject(res);
                }
                resolve(res);
            });
        });
    },
    _sendCreationDataInfo : (user) => {
        return mailer._callMailService('user/createMail', _.pick(user, [ 'firstname', 'lastname', 'login', 'password' ]));
    },
    _sendUpdatedDataInfo  : (user) => {
        return mailer._callMailService('user/updateUser', _.pick(user, [ 'firstname', 'lastname' ]));
    },
    _sendNewPasswordInfo  : (user) => {
        return mailer._callMailService('user/changePassword', _.pick(user, [ 'firstname', 'lastname', 'password' ]));
    },
    register : (server, option, next) => {
        mailer._socket = io('http://0.0.0.0:8081');
        
        mailer._socket.on('connect', () => {
            server.log('info', 'Connected to mail service');
        });
        
        server.decorate('server', 'mailer', {
            'sendCreationDataInfo' : mailer._sendCreationDataInfo,
            'sendNewPasswordInfo'  : mailer._sendNewPasswordInfo,
            'sendUpdatedDataInfo'  : mailer._sendUpdatedDataInfo
        });
        
        next();
    }
};

module.exports.register = mailer.register;

module.exports.register.attributes = {
    name    : 'mailer',
    version : '0.1.0'
};