# email_dispatcher
A general purpose email dispatcher and associated toolkit

# Setup

1. Set up an AWS Account with Simple Email Service access (SES) (https://docs.bitnami.com/aws/how-to/use-ses/)
2. Set your AWS_KEY and AWS_SECRET in the .env file
3. Edit index.js to send an email to your own email address (it's set to anthonyi1854@gmail.com - that's me!)

# Run
```
npm install

node index.js
```
# Test

The emailCreator.js file is a utility to help you create new email templates. One already exists called tai_test.hbs.

To create your own, you'll need to do 2 things.

1. Edit data.js to include a data entry for your new email (without the extension). Copy the existing tai_test entry to verify
2. Create the new email data file. Handlebars is the templating engine used here

To compile your test emails, run:
```
node emailCreator.js
```
The files will be generated into the "tests" folder. Open with your browser to view.
