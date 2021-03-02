const AWS = require('aws-sdk');
const dotenv = require("dotenv");

AWS.config.update({region: 'eu-west-3'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

dotenv.config({
    path: './.env'
});

var params = {
 AttributeNames: [
    "SentTimestamp"
 ],
 MaxNumberOfMessages: 10,
 MessageAttributeNames: [
    "All"
 ],
 QueueUrl: process.env.QUEUE_URL,
 VisibilityTimeout: 20,
 WaitTimeSeconds: 0
};

sqs.receiveMessage(params, function(err, data) {
  if (err) {
    console.log("Receive Error", err);
  } else if (data.Messages) {
    var deleteParams = {
      QueueUrl: process.env.QUEUE_URL,
      ReceiptHandle: data.Messages[0].ReceiptHandle
    };
    console.log(data.Messages);
    /*sqs.deleteMessage(deleteParams, function(err, data) {
      if (err) {
        console.log("Delete Error", err);
      } else {
        console.log("Message Deleted", data);
      }
    });*/
  }
});