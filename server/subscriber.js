// Import necessary libraries
import { socket } from "zeromq";

//protobuf imports
import pkg from "protobufjs";
const { loadSync } = pkg;
const root = loadSync("proto/messages.proto");
const Position = root.lookupType("player.positions.Position");

// Create a ZeroMQ subscriber socket
const subscriber = socket("sub");

// Connect the socket to the publisher's port
const port = "tcp://127.0.0.1:3001";
subscriber.connect(port);
subscriber.subscribe("");

//import JSON file
import fs from "fs";
import { error } from "console";

class fileQueue {
  constructor() {
    this.items = [];
    this.headIndex = 0;
    this.tailIndex = 0;
  }

  enqueue(item) {
    if (item) {
      this.items[this.tailIndex] = item;
      this.tailIndex++;
      console.log("queued");
    } else {
      throw new Error("Unable to Queue");
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const dequeueItem = this.items[this.headIndex];
    this.headIndex++;
    console.log("dequeued", this.items.length);
    return dequeueItem;
  }

  isEmpty() {
    if (this.size() === 0) {
      return true;
    } else {
      return false;
    }
  }

  size() {
    return this.headIndex - this.tailIndex;
  }

  execute() {
    // Process all items in the queue
    while (!this.isEmpty()) {
      const dequeue = this.dequeue();
      writeToFunction(dequeue);
    }
  }
}

const writeToFunction = (positionMessage) => {
  fs.readFile("./server/positionData.json", "utf-8", (err, positionData) => {
    try {
      if (err) {
        throw new Error(err);
      }
      console.log(positionMessage);

      const Id = positionMessage.sensorId;
      const timestamp = positionMessage.timestampUsec;
      const data3d = positionMessage.data3d;

      const newPositionData = {
        sensorId: Id,
        timestamp: timestamp,
        data3d: data3d,
      };

      const data = JSON.parse(positionData);
      if (!data?.positions) {
        data.positions = {};
      }

      if (data.positions[Id]) {
        data.positions[Id].push(newPositionData);
      } else {
        data.positions[Id] = [newPositionData];
      }

      fs.writeFile(
        "./server/positionData.json",
        JSON.stringify(data),
        "utf-8",
        (err) => {
          if (err) {
            throw new Error(err);
          } else {
            console.log("File written successfully");
          }
        }
      );
    } catch (error) {
      console.error("Unable to write new data to JSON file", error);
    }
  });
};

const Queue = new fileQueue();

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
