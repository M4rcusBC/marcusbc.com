const twilio = require('twilio');
const config = require('../config/config');

const client = twilio(
    config.TWILIO_ACCOUNT_SID,
    config.TWILIO_AUTH_TOKEN
);

exports.sendVerificationSMS = async (phoneNumber, code) => {
    return client.messages.create({
        body: `Your verification code for marcusbc.com is: ${code}`,
        from: config.TWILIO_PHONE_NUMBER,
        to: phoneNumber
    });
};