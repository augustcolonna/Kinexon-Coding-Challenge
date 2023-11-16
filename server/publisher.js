// const zmq = require("zeromq");
// const publisher = zmq.socket("pub");
// publisher.bindSync("tcp://127.0.0.1:3000");

// setInterval(() => {
//   console.log("Sending message");
//   publisher.send("Hello, World!");
// }, 1000);

// Import necessary libraries
const zmq = require("zeromq");
const messages = require("../proto/messages_pb");
const protobuf = require("google-protobuf");

// Create a ZeroMQ publisher socket
const publisher = zmq.socket("pub");

// Bind the socket to a port
const port = "tcp://127.0.0.1:3001";
publisher.bindSync(port);
console.log(`Publisher bound to ${port}`);

// Function to generate a random position
function generateRandomPosition() {
  return new messages.Data3d({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 3,
  });
}

// // Function to add noise to the position
// function addNoise(coordinates) {
//   return new messages.Data3d({
//     x: coordinates.x + (Math.random() - 0.5) * 0.3,
//     y: coordinates.y + (Math.random() - 0.5) * 0.3,
//     z: coordinates.z + (Math.random() - 0.5) * 0.3,
//   });
// }

// Function to publish updates
function publishUpdates() {
  setInterval(() => {
    for (let i = 1; i <= 10; i++) {
      const timestamp_usec = Date.now() * 1000;
      // console.log(timestamp_usec);
      const position = generateRandomPosition();
      // console.log(position.array);
      // const positionWithNoise = addNoise(position);
      // console.log(positionWithNoise.array);
      const message = new messages.Position({
        sensorId: i,
        timestamp_usec: timestamp_usec,
        data3d: position,
      });

      const serializedMessage = message.serializeBinary();

      publisher.send(["", serializedMessage]);
    }
  }, 1000);
}

publishUpdates();
