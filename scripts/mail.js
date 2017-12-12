/**
 * Created by Administrator on 2017/12/6.
 * 邮件发送
 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./mailConfig');
/*
 '1und1', 'AOL', 'DebugMail.io',''DynectEmail','FastMail',
 'GandiMail','Gmail','Godaddy','GodaddyAsia','GodaddyEurope',
 'hot.ee','Hotmail','iCloud','mail.ee','Mail.ru','Mailgun',
 'Mailjet','Mandrill','Naver','OpenMailBox','Postmark','QQ',
 'QQex','SendCloud','SendGrid','SES','SES-US-EAST-1','SES-US-WEST-1',
 'SES-EU-WEST-1','Sparkpost','Yahoo','Yandex','Zoho'
* */
smtpTransport = nodemailer.createTransport(smtpTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
}));

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
  function sendMail(recipient, subject, html) {

    smtpTransport.sendMail({

        from: config.email.user,
        to: recipient,
        subject: subject,
        html: html

    }, function (error, response) {
        if (error) {
            console.log(error);
        }else {
            console.log('发送成功')
        }
    });
}

module.exports = sendMail;