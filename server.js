"use strict";
const request = require('request')

class SendMsg {

    /**
     * @param {string} authKey 
     * @param {string, optional} messageTemplate
     */
    constructor(authKey, messageTemplate) {
        this.authKey = authKey;
        this.messageTemplate = messageTemplate;       
        this.otp_expiry = 1440; //1 Day = 1440 minutes
    }

    /**
     * @returns {string} 
     */
    static getBaseURL() {
        return baseURL;
    }

    setOtpExpiry(otp_expiry) {
        this.otp_expiry=otp_expiry;
        return;
    }

    /**
     * Returns the 4 digit otp
     * @returns {integer}
     */
    static generateOtp() {
        return Math.floor(1000 + Math.random() * 9000);
    }

    /**
     * Send Otp to given mobile number
     * @param {string} contactNumber receiver's mobile number along with country code
     * @param {string} senderId
     * @param {string} baseURL
     * @param {string, optional} otp
     * Return promise if no callback is passed and promises available
     */
    send(contactNumber, senderId, baseURL, dltTemplateID, otp) {
        let args = {
                authkey: this.authKey,
                mobiles: contactNumber,
                message: this.messageTemplate.replace('{{otp}}', otp),
                sender: senderId,
                route: 4,
                DLT_TE_ID: dltTemplateID,
                
            };
        return SendMsg.doRequest('get', "sendhttp.php", args, baseURL);
    }

    /**
     * Retry Otp to given mobile number
     * @param {string} contactNumber receiver's mobile number along with country code
     * @param {boolean} retryVoice, false to retry otp via text call, default true
     */
    

    /**
     * @param {string} contactNumber receiver's mobile number along with country code
     * @param {string} otp otp to verify
     */
    

    static doRequest (method, path, params, baseURL) {        

        let options = {
            method: method,
            url: baseURL + "" + path
        };

        if (method === 'get') {
            options.qs = params;
        }

        if (method === 'post') {
            let formKey = 'form';

            if (typeof params.media !== 'undefined') {
                formKey = 'formData';
            }
            options[formKey] = params;
        }

        request(options, function(error, response, data) {            

            try {
                if (data === '') {
                    data = {};
                }
                else {
                    data = JSON.parse(data);
                }
            }
            catch(parseError) {
                return (
                    new Error('JSON parseError with HTTP Status: ' + response.statusCode + ' ' + response.statusMessage),
                    data
                );
            }           
        });
    };
}
module.exports = SendMsg;