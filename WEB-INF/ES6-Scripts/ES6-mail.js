/**
 * Created by Administrator on 2017/12/21.
 */

const nodemailer = require('nodemailer');
const config = require('./mailConfig');
let smtpTransport = require('nodemailer-smtp-transport');


smtpTransport=nodemailer.createTransport(smtpTransport({
    service:config.email.service,
    auth:{
        user:config.email.user,
        pass:config.email.pass
    }
}));

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
sendMail=(recipient,subject,html)=>{
    smtpTransport.sendMail({

        from: config.email.user,
        to: recipient,
        subject: subject,
        html: html

    },(error,response)=>{
        if(error){
            console.log(error);
        }else {
            console.log('发送成功');
        }
    });
};
module.exports =sendMail;