// const zmq = require("zeromq");
// const subscriber = zmq.socket("sub");

// subscriber.connect("tcp://127.0.0.1:3000");
// subscriber.subscribe("");

// subscriber.on("message", (message) => {
//   console.log(`Received message: ${message.toString()}`);
// });

// Import necessary libraries
const zmq = require("zeromq");
const messages = require("../proto/messages_pb");

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
    const positionMessage = messages.Position.deserializeBinary(message);
    console.log(positionMessage);
    console.log("<------------NEW POSITION MESSAGE------------>");
    console.log("Received Position Message:");
    console.log(`Sensor ID: ${positionMessage.getSensorid()}`);
    console.log(`Timestamp (usec): ${positionMessage.getTimestampUsec()}`);
    console.log(`Position Data: ${positionMessage.getData3d()}`);
    // Process the received position message

    // console.log("Received Position Message:");
    // console.log(`Sensor ID: ${positionMessage.array.sensorId}`);
    // console.log(`Timestamp (usec): ${positionMessage.array.timestamp_usec}`);

    // const data3d = positionMessage.array.data3d;
    // if (data3d) {
    //   console.log(
    //     `Position Data: ${data3d.array.x}, ${data3d.array.y}, ${data3d.array.z}`
    //   );
    // } else {
    //   console.log(`Position Data is undefined`);
    // }
  } catch (error) {
    console.error("Error deserializing message:", error);
  }
});
