var AWS = require('aws-sdk');
AWS.config.logger = console;

var sqs = new AWS.SQS({accessKeyId:"fml", secretAccessKey: "ffs", region: "us-east-1", apiVersion: '2012-11-05'});

module.exports.handler = async (event) =>  {
  try {
    const message = {
      bucket: event.Records[0].s3.bucket,
      object: event.Records[0].s3.object
    }
    console.log(`message: ${JSON.stringify(message)}`);
    var params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: `http://${process.env.LOCALSTACK_HOSTNAME}:4566/000000000000/test-queue`,
      MessageGroupId: "default",

    };
    await sqs.sendMessage(params).promise()
      .then(data => console.log("Successfully added message to queue", data.MessageId))
      .catch(err => console.log("Error: ", err));;
  } catch (err) {
    console.log(err);
  }
}
