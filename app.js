const dotenv = require("dotenv");
const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
const nmbrsAPI = require('./nmbrsAPI');
const helpers = require('./helpers');

dotenv.config({
  path: './.env'
});

const queueURL = process.env.QUEUE_URL;
AWS.config.update({ region: process.env.SQS_REGION, });

const app = Consumer.create({
  queueUrl: queueURL,
  handleMessage: async (message) => {
    let data = helpers.normalizeMessage(message.Body);
    if (helpers.validateMessage(data.source_app, data.user, data.pass, data.group, data.controller)) {
      helpers.writeAllAbsences(data.user, data.pass, data.source_app, data.group);
    } else {
      console.log("not a valid message");
    }
  },
  sqs: new AWS.SQS()
});

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.on('timeout_error', (err) => {
  console.error(err.message);
});

app.on('message_received', (message) => {
  console.error("Received a message");
});

app.on('message_processed', (message) => {
});

app.start();