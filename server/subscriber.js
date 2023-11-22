// Import necessary libraries
import { socket } from "zeromq";
import pkg from "protobufjs";

//import utilities
import FileQueue from "./fileQueue.js";

//protobuf imports
const { loadSync } = pkg;
const root = loadSync("proto/messages.proto");
const Position = root.lookupType("player.positions.Position");

// Create a ZeroMQ subscriber socket
const subscriber = socket("sub");

// Connect the socket to the publisher's port
const port = "tcp://127.0.0.1:3001";
subscriber.connect(port);
subscriber.subscribe("");

const Queue = new FileQueue();

// Handle incoming messages
subscriber.on("message", (topic, message) => {
  try {
    const positionMessage = Position.decode(message);
    Queue.enqueue(positionMessage);
  } catch (error) {
    console.error("Error decoding message:", error);
  }
});

setInterval(() => {
  Queue.execute();
}, 1000);
