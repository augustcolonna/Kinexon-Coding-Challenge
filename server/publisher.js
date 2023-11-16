// Import necessary libraries
const zmq = require("zeromq");

const protobuf = require("protobufjs");
const root = protobuf.loadSync("proto/messages.proto");
const Data3d = root.lookupType("player.positions.Data3d");
const Position = root.lookupType("player.positions.Position");

// Create a ZeroMQ publisher socket
const publisher = zmq.socket("pub");

// Bind the socket to a port
const port = "tcp://127.0.0.1:3001";
publisher.bindSync(port);
console.log(`Publisher bound to ${port}`);

// Function to generate a random position
function generateRandomPosition() {
  return Data3d.create({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 3,
  });
}

// Function to add noise to the position
function addNoise(coordinates) {
  return Data3d.create({
    x: coordinates.x + (Math.random() - 0.5) * 0.3,
    y: coordinates.y + (Math.random() - 0.5) * 0.3,
    z: coordinates.z + (Math.random() - 0.5) * 0.3,
  });
}

// Function to publish updates
function publishUpdates() {
  setInterval(() => {
    for (let i = 1; i <= 10; i++) {
      const timestamp = new Date();
      const timestamp_usec = Math.floor(timestamp / 1000000);
      const position = generateRandomPosition();

      const positionWithNoise = addNoise(position);

      const message = Position.create({
        sensorId: i,
        timestamp_usec: timestamp_usec,
        data3d: positionWithNoise,
      });

      const encodeMessage = Position.encode(message).finish();

      publisher.send(["", encodeMessage]);
    }
  }, 1000);
}

publishUpdates();
