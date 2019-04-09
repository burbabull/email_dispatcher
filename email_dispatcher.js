const fs = require("fs");
const Handlebars = require("handlebars");
const ses = require("node-ses");
const _ = require("lodash");
const moment = require("moment");
const s3_key = process.env.AWS_KEY;
const s3_secret = process.env.AWS_SECRET;
const sender = "YOUR NAME <support@novitafinancial.com>";
require("moment-recur");
const helpers = require("./helpers");

/* Models */
/* SES Client */
const client = ses.createClient({
    key: s3_key,
    secret: s3_secret,
    amazon: "https://email.us-west-2.amazonaws.com"
});

function generateGaClientId() {
    let ts = Math.round(+new Date() / 1000.0);
    let rand;

    try {
        let uu32 = new Uint32Array(1);
        rand = crypto.getRandomValues(uu32)[0];
    } catch (e) {
        rand = Math.round(Math.random() * 2147483647);
    }

    return [rand, ts].join(".");
}

/**
 * Replace YOUR_GA_TRACKING_CODE with your Google Analytics tracker, looks like GA-1234567
 * @param subject
 * @returns {string}
 */
function makeTrackingCode(subject) {
    return `<img src="https://www.google-analytics.com/collect?v=1&tid=YOUR_GA_TRACKING_CODE&cid=\
${generateGaClientId()}&t=event&ec=email&ea=open&el=${subject}"/>`;
}

exports.compileEmail = function(
    selectedTemplate,
    emailTarget,
    emailContent,
    subject
) {
    const template = Handlebars.compile(selectedTemplate,  {knownHelpers: helpers});
    emailContent["email"] = emailTarget.email;
    emailContent["emailtracking"] = makeTrackingCode(subject);
    emailContent["campaignTracking"] = campaignTrackingGenerator(subject);
    emailContent["name"] = emailTarget.username;
    return template(emailContent);
};

exports.getTemplate = function() {
    return fs.readFileSync(__dirname + "/tai_test.hbs", 'utf8');
};

exports.getTemplateByName = function(name) {
    return fs.readFileSync(__dirname + `/${name}.hbs`, 'utf8');
};

/**
 * Wrapper function to compile an email, then send it.
 * Under the hood, just uses compileEmail, then sendEmailToUser
 * @param selectedTemplate
 * @param emailData: <{subject: string, title: string, resetPasswordKey: string, user: User>
 * Need resetPasswordKey for reset pwd email
 * need title
 */
exports.compileAndSend = function(selectedTemplate, emailData) {
    console.log("Sending mail with credentials ", s3_key, s3_secret);
    let compiledTemplate = exports.compileEmail(
        selectedTemplate,
        emailData.user,
        emailData,
        emailData.subject
    );
    return sendEmailToUser(
        emailData.user.email,
        emailData.subject,
        compiledTemplate,
        emailData.contentText,
        emailData.user
    );
};

function sendEmailToUser(
    target,
    subject,
    content,
    contentText
) {
    // give SES the details and let it construct the message for you.
    return new Promise((resolve, reject) => {
        client.sendEmail(
            {
                to: target,
                from: sender,
                // bcc: ["support@novitafinancial.com"],
                subject: subject,
                message: content,
                altText: contentText
            },
            function(err, data, res) {
                if (err) {
                    console.log("NEWSLETTERS: Error in SES Send!!!", err);
                    reject(err);
                } else {
                    console.log("successfully sent email to user ", target);
                    resolve();
                }
            }
        );
    })
}

exports.logEvent = function (subject, content, contentText) {
    return sendEmailToUser('YourLogEmail@gmail.com', subject, content, contentText);
};

exports.sendEmailToUser = sendEmailToUser;

function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function campaignTrackingGenerator(subject) {
    const fixedSubject = subject.replace(/ /g, '+');
    return `?utm_medium=email&utm_campaign=${fixedSubject}&utm_source=time`
}
