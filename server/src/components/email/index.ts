const nodemailer = require("nodemailer")
const config = require("config");
const ejs = require("ejs");
const path = require("path");
const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requiredTLS: true,
    auth: {
        user: config.get("MAIL_USER"),
        pass: config.get("MAIL_PASSWORD")
    }
});
const https = require('https');

// var request = require('request');

let username = config.BULK_SMS_USERNAME;
let password = config.BULK_SMS_PASSWORD;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.SENDGRID_API_KEY);
// const Twilio = require('twilio');
// let twilioClient = new Twilio(
//     config.TWILIO_API_KEY, config.TWILIO_API_SECRET, {accountSid: config.TWILIO_ACCOUNT_SID}
// );
// const client = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
//console.log(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

const verifyMail = (username: string, to: string, subject: string, text_body: string, sender: string, otp: any, message: string, host: string, mobile: string, currentDate: any) => {
    try {
        const location_file = path.join(__dirname + '/../email/verificationEmail.ejs')
        const logo = "http://" + host + config.get("LOGO_PATH");//"/uploads/images/logo.svg";

        ejs.renderFile(location_file, { name: username, email: to, otp: otp, logo: logo, subject: subject, mobile: mobile, currentDate: currentDate }, async function (err: any, data: any) {
            if (err) {
                console.log(err);
            } else {

                const msg = {
                    to: to,
                    from: 'Example <no-reply@example.com>',
                    subject: subject,
                    text: text_body,
                    html: data
                };
                (async () => {
                    try {
                        await sgMail.send(msg);
                    } catch (error: any) {
                        console.error(error.message);

                        if (error.response) {
                            console.error(error.response.body)
                        }
                    }
                })();
            }
        });
    }
    catch (e) {
        console.log(e)
    }
}

const sendVerificationEmail = async (name: string, email: string, subject: string, otp: any, message: string, host: string, mobile: string, companyName: string) => {
    try {
        const location_file = path.join(__dirname + '/../email/verificationEmail.ejs')
        const logo = "http://" + host + config.get("LOGO_PATH");///"/uploads/images/logo.svg";

        await ejs.renderFile(location_file, { name: name, email: email, otp: otp, logo: logo, mobile: mobile, companyName: companyName }, async function (err: any, data: any) {
            if (err) {
                console.log("email send error:", err);

            } else {

                const msg = {
                    to: email,
                    from: 'Example <no-reply@example.com>', // Use the email address or domain you verified above
                    subject: subject,
                    text: "You receive this mail because of Email Varification",
                    html: data
                };
                (async () => {
                    try {
                        await sgMail.send(msg);
                    } catch (error: any) {
                        console.error(error.message);

                        if (error.response) {
                            console.error(error.response.body)
                        }
                    }
                })();
            }
        });
    } catch (e) {
        console.log("catch erro ", e)
    }
}

const sendMobileOTP = async (body: any, from: any, to: any) => {

    try {
        // let test_body ="your binox verification code is " +body;
        let postData = JSON.stringify({
            'to': to,
            'routingGroup': "PREMIUM",
            'body': body
        });

        let options = {
            hostname: 'api.bulksms.com',
            port: 443,
            path: '/v1/messages',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
                'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
                // 'Authorization': 'Basic Ymlub3hiYXJnYWluczpCaW5veGJ1bGtzbXMyMTEyMjI='
            }
        };

        let req = https.request(options, (resp: any) => {
            // console.log('statusCode:', resp.statusCode);
            let data = '';
            resp.on('data', (chunk: any) => {
                data += chunk;
            });
            resp.on('end', () => {
                // console.log("Response:", data);
            });
        });

        req.on('error', (e: any) => {
            console.error(e);
        });

        req.write(postData);
        req.end();
    } catch (err: any) {
        console.log(err.message);
    }

}

const sendEmailWithPassword = async (name: string, email: string, password: any, subject: string, message: string, host: string) => {
    try {

        const location_file = path.join(__dirname + '/../email/sendPassword.ejs')
        const logo = "http://" + host + config.get("LOGO_PATH");//"/uploads/images/logo.png";

        await ejs.renderFile(location_file, { name: name, email: email, password: password, logo: logo }, async function (err: any, data: any) {
            if (err) {
                console.log("email send error:", err);

            } else {

                const msg = {
                    to: email,
                    from: 'Example <no-reply@example.com>', // Use the email address or domain you verified above
                    subject: subject,
                    text: message,
                    html: data
                };
                (async () => {
                    try {
                        await sgMail.send(msg);
                    } catch (error: any) {
                        console.error(error.message);

                        if (error.response) {
                            console.error(error.response.body)
                        }
                    }
                })();
            }
        });
    } catch (e) {
        console.log("catch erro ", e)
    }
}

export default {
    verifyMail,
    sendVerificationEmail,
    sendMobileOTP,
    sendEmailWithPassword,
}
