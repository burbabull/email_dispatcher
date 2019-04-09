const dotenv = require('dotenv');
dotenv.config();
const emailDispatcher = require('./email_dispatcher.js');

const data = {
    content: "This is your email content",
    user: {
        name: {
            first: "Sender",
            last: "Lastname"
        },
        email: "anthonyi1854@gmail.com"
    },
    subject: "Your Email Subject",
    emailBase: "",
    companyName: "Your Company Name",
    webBase: "www.yourwebsite.com"
}
emailDispatcher.compileAndSend(emailDispatcher.getTemplate(), data);
