
var kafka = require('kafka-node');
var Producer = kafka.Producer;
var KeyedMessage = kafka.KeyedMessage;
var Client = kafka.KafkaClient;
var client = new Client('kafka');
var topic = 'node-test-0';
var p = 0;
var a = 0;
var producer = new Producer(client, { requireAcks: 1 });

producer.on('ready', function () {
  var message = 'a message xxx';

  producer.send([{ topic: topic, partition: p, messages: [message], attributes: a }], function (err, result) {
    console.log(err || result);
    process.exit();
  });
});

producer.on('error', function (err) {
  console.log('error', err);
});