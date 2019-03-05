var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var Client = kafka.KafkaClient;
var client = new Client('127.0.0.1:2181');

var topic = 'test-topic';
var partition = 0;

var topics = [{
  topic: topic, partition: partition
}];

var options = {
// Auto commit config
    autoCommit: true,
    autoCommitMsgCount: 100,
    autoCommitIntervalMs: 5000,
// Fetch message config
    fetchMaxWaitMs: 100,
    fetchMinBytes: 1,
    fetchMaxBytes: 1024 * 10,
    fromOffset: false,
    fromBeginning: false
};
var consumer = new Consumer(client, topics, options);


consumer.on('message', function(message) {
  console.log(message);
});

consumer.on('error', function(err) {
  console.log('error', err);
});

