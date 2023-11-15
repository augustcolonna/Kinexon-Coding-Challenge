const zmq = require("zeromq");
const publisher = zmq.socket("pub");

publisher.bindSync("tcp://127.0.0.1:3000");

setInterval(() => {
  console.log("Sending message");
  publisher.send("Hello, World!");
}, 1000);
