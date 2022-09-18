var nodemailer = require('nodemailer');
const { HandleResponse } = require('../config/utils')
const { mailUser, mailPassword } = require("../config/index");

module.exports = {
    sendMail (from, receiver, subject, message) {
        return sendEmail(from, receiver, subject, message).then(function(result) {
            return result;
        })
    }
}


function sendEmail (from, receiver, subject, message) {
    var sender = from;
    var receiver = receiver;
    var subject = subject;
    var message = message;

    var infoResult = {};

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,  // 465 or 587
        secure:true,
        // requireTLS:true,
        auth: {
            user: mailUser, // enter your email address
            pass: mailPassword  // enter your visible/encripted password
        }
    });
    
    var mailOptions = {
        from: sender,
        to: receiver,
        subject: subject,
        text: message
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info){
            // callback(HandleResponse(error, error, res))
            if (error) {
                console.log("Mail error", error);
                //    return HandleResponse(error, null, res)
                infoResult = { message: error, error: true };
            } else {
                console.log('Email success: ' + info.response);
                // return HandleResponse(info, null, res)
                infoResult = { message: info.response, error: false };
            }
        });

        console.log('Email was sent: ' + JSON.stringify(infoResult));

        resolve({
            status: true,
            message: "Mail sent successfully",
            response: infoResult,
        })

        reject({
            status: false,
            message: "Mail sent failure",
            response: error,
        })
    })
}