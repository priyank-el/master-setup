import { EventEmitter } from 'events';
import Mail from "../components/email";

const eventEmitter = new EventEmitter();

eventEmitter.on('send_email_otp', (data: any) => {
    Mail.verifyMail(data.username, data.to, data.data.message, data.sender, data?.data.otp,data.currentDate)
});

// eventEmitter.on('send_verification_email', (data: any) => {
//     Mail.sendVerificationEmail(data.name, data.email, data.subject, data.otp, data.message, data.host);
// });
eventEmitter.on('send_mobile_otp', (data: any) => {
    // console.log(data.subject)
    Mail.sendMobileOTP(data.subject, data.from, data.to);
});
eventEmitter.on('send_email_with_password', (data: any) => {
    Mail.sendEmailWithPassword(data.username, data.to, data.password, data.subject, data.message, data.host);
});

export default eventEmitter;