'use strict';

const Mailgen    = require('mailgen');
const Nodemailer = require('nodemailer');
const _          = require('lodash');

const mailer = {
    _sendMail             : (context) => {
        return new Promise((resolve, reject) => {
            mailer._transporter.sendMail(_.assignIn({
                from    : 'mysublimeapp@nodejs.com', // sender address
                to      : 'yoann.test.test@gmail.com', // list of receivers
                subject : 'Your profile was updated', // Subject line
            }, context), (error, info) => {
                if (error) {
                    reject(error);
                }
                resolve(info);
            });
        });
    },
    _sendCreationDataInfo : (user) => {
        let mailTemplate = {
            body : {
                name  : user.firstname + ' ' + user.lastname,
                intro : [
                    'Welcome to my beautiful user app! We\'re very excited to have you on board.',
                    `Your login is ${ user.login }`,
                    `Your password is ${ user.password }`
                ],
                outro : 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };
        
        return mailer._sendMail({
            subject : 'Welcome and check your information', // Subject line
            text    : mailer._mailGenerator.generatePlaintext(mailTemplate), // plaintext body
            html    : mailer._mailGenerator.generate(mailTemplate) // html body
        });
    },
    _sendUpdatedDataInfo  : (user) => {
        let mailTemplate = {
            body : {
                name  : user.firstname + ' ' + user.lastname,
                intro : [ 'Your profile was updated just now!' ],
                outro : 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };
        
        return mailer._sendMail({
            subject : 'Your profile was updated', // Subject line
            text    : mailer._mailGenerator.generatePlaintext(mailTemplate), // plaintext body
            html    : mailer._mailGenerator.generate(mailTemplate) // html body
        });
    },
    _sendNewPasswordInfo  : (user) => {
        let mailTemplate = {
            body : {
                name  : user.firstname + ' ' + user.lastname,
                intro : [
                    'As you requested, we changed your password',
                    `Your new password is <code>${ user.password }</code>`
                ],
                outro : 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };
        
        return mailer._sendMail({
            subject : 'Your password was updated', // Subject line
            text    : mailer._mailGenerator.generatePlaintext(mailTemplate), // plaintext body
            html    : mailer._mailGenerator.generate(mailTemplate) // html body
        });
    },
    
    register : (server, option, next) => {
        mailer._server        = server;
        mailer._transporter   = Nodemailer.createTransport(`smtps://${process.env.NODE_SMTP_USER}:${process.env.NODE_SMTP_PASSWORD}@smtp.gmail.com`);
        mailer._mailGenerator = new Mailgen({
            theme   : 'salted',
            product : {
                name : 'HAPI SERVER',
                link : 'https://nolink.com/'
            }
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