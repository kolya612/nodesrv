const kafka = require('kafka-node');
const Producer = kafka.Producer;
const Client = kafka.KafkaClient;

class KafkaEventBus {

//var topic = 'node-test-0';
//var p = 0;
//var a = 0;


	constructor(){
		this.client = new Client({kafkaHost: 'kafka:9092'});
		this.producer = new Producer(this.client);
	}

	sender(message, topic, partition, attributes){
		if (partition === undefined) {
		    partition = 0;
		}
		if (attributes === undefined) {
		    attributes = 0;
		}	
		try{
		    this.producer.send([{ topic: topic , partition: partition, messages: [message], attributes: attributes }], function (err, result) {
			    console.log(err || result);
			    return (err || result);
			    process.exit();
			});
	  	} catch(e) {
	  		console.log(e);
	  	}			
	}

}

module.exports = {
    KafkaEventBus,
};

// producer.on('error', function (err) {
//   console.log('error', err);
// });