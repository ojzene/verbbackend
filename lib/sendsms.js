var nodemailer = require('nodemailer');
const { HandleResponse } = require('../config/utils')
const { mailUser, mailPassword } = require("../config/index");

module.exports = {
    sendSMS (from, receiver, subject, message, res) {
        var sender = from;
        var receiver = receiver;
        var subject = subject;
        var message = message;

        var infoResult = {};

        var mailOptions = {
            from: sender,
            to: receiver,
            subject: subject,
            text: message
        };
        // Send SMS Library Function here
    }
}
