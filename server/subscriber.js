// Import necessary libraries
const express = require("express");
const app = express();
const zmq = require("zeromq");

//protobuf imports
const protobuf = require("protobufjs");
const root = protobuf.loadSync("proto/messages.proto");
const Position = root.lookupType("player.positions.Position");

// Create a ZeroMQ subscriber socket
const subscriber = zmq.socket("sub");

// Connect the socket to the publisher's port
const port = "tcp://127.0.0.1:3001";
subscriber.connect(port);
subscriber.subscribe("");

// Import the 'events' module for the EventEmitter
const EventEmitter = require("events");
const messageEmitter = new EventEmitter();

//import JSON file
const fs = require("fs");

// Handle incoming messages
subscriber.on("message", (topic, message) => {
  try {
    console.log(message);
    const positionMessage = Position.decode(message);

    // console.log("<------------NEW POSITION MESSAGE------------>");
    // console.log("Received Position Message:");
    // console.log(`Sensor ID: ${positionMessage.sensorId}`);
    // console.log(`Timestamp (usec): ${positionMessage.timestamp_usec}`);
    // console.log(
    //   `Position Data: X | ${positionMessage.data3d.x}, Y | ${positionMessage.data3d.y}, Z | ${positionMessage.data3d.z}`
    // );

    messageEmitter.emit("newMessage", positionMessage);
  } catch (error) {
    console.error("Error deserializing message:", error);
  }
});

messageEmitter.on("newMessage", (positionMessage) => {
  // console.log("<------------NEW POSITION MESSAGE VOLUME 2------------>");
  // console.log("Received Position Message:");
  // console.log(positionMessage.sensorId);
  // console.log(
  //   positionMessage.data3d.x,
  //   positionMessage.data3d.y,
  //   positionMessage.data3d.z
  // );

  // fs.readFile("./server/positionData.json", "utf-8", (err, jsonString) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     try {
  //       const data = JSON.parse(jsonString);
  //       console.log(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // });

  //   // const positionData = [positionDataMessage];

  fs.writeFile(
    "./server/positionData.json",
    JSON.stringify(positionMessage),
    "utf-8",
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("File written successfully");
      }
    }
  );
});
