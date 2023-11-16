// Import necessary libraries
const zmq = require("zeromq");
// const messages = require("../proto/messages_pb");
const protobuf = require("protobufjs");
const root = protobuf.loadSync("proto/messages.proto");

const Position = root.lookupType("player.positions.Position");
// Create a ZeroMQ subscriber socket
const subscriber = zmq.socket("sub");

// Connect the socket to the publisher's port
const port = "tcp://127.0.0.1:3001";
subscriber.connect(port);
console.log(`Subscriber connected to ${port}`);

// Subscribe to all messages

subscriber.subscribe("");

// Handle incoming messages
subscriber.on("message", (topic, message) => {
  try {
    const positionMessage = Position.decode(message);
    console.log(positionMessage);

    console.log("<------------NEW POSITION MESSAGE------------>");
    console.log("Received Position Message:");
    console.log(`Sensor ID: ${positionMessage.sensorId}`);
    console.log(`Timestamp (usec): ${positionMessage.timestamp_usec}`);
    console.log(
      `Position Data: X | ${positionMessage.data3d.x}, Y | ${positionMessage.data3d.y}, Z | ${positionMessage.data3d.z}`
    );
  } catch (error) {
    console.error("Error deserializing message:", error);
  }
});
