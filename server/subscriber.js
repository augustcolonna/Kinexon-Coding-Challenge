const zmq = require("zeromq");
const subscriber = zmq.socket("sub");

subscriber.connect("tcp://127.0.0.1:3000");
subscriber.subscribe("");

subscriber.on("message", (message) => {
  console.log(`Received message: ${message.toString()}`);
});
