'use strict';

const Mailgen         = require('mailgen');
const Nodemailer      = require('nodemailer');

const mailer = {
    _sendInfo : (user) => {
        return new Promise((resolve, reject) => {
            let mailTemplate = {
                body: {
                    name: user.firstname + ' ' + user.lastname,
                    intro: ['Welcome to my beautiful user app! We\'re very excited to have you on board.', `Your login is ${ user.login }`, `Your password is ${ user.password }`],
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
                }
            };
            
            mailer._transporter.sendMail({
                from: 'mysublimeapp@nodejs.com', // sender address
                to: 'yoann.test.test@gmail.com', // list of receivers
                subject: 'Welcome and check your information', // Subject line
                text: mailer._mailGenerator.generatePlaintext(mailTemplate), // plaintext body
                html: mailer._mailGenerator.generate(mailTemplate) // html body
            }, (error, info) => {
                if(error){
                    reject(error);
                }
                resolve(info);
            });
        })
    },
    
    register : (server, option, next) => {
        mailer._server = server;
        mailer._transporter = Nodemailer.createTransport(`smtps://${process.env.NODE_SMTP_USER}:${process.env.NODE_SMTP_PASSWORD}@smtp.gmail.com`);
        mailer._mailGenerator = new Mailgen({
            theme: 'salted',
            product: {
                name: 'User hapi test trololo',
                link: 'https://nolink.com/'
            }
        });

        server.decorate('server', 'mailer', {
            'sendInfo' : mailer._sendInfo
        });
        
        next();
    }
};

module.exports.register = mailer.register;

module.exports.register.attributes = {
    name    : 'mailer',
    version : '0.1.0'
};