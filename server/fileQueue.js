import { writeToFile } from "./writeToFile.js";

export default class FileQueue {
  constructor() {
    this.items = [];
    this.isRunning = false;
  }

  enqueue(item) {
    if (item) {
      this.items.push(item);
      console.log("queued");
    } else {
      throw new Error("Unable to Queue");
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const dequeueItem = this.items.shift();
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
    return this.items.length;
  }

  async execute() {
    console.log("starting execute loop");
    if (this.isEmpty()) {
      console.log("Not starting - Empty");
      return;
    }

    if (this.isRunning) {
      console.log("Not starting - Already runnning");
      return;
    }

    // Process all items in the queue
    while (!this.isEmpty()) {
      console.log("Executing");
      this.isRunning = true;
      const dequeue = this.dequeue();
      await writeToFile(dequeue);
    }

    if (this.isEmpty()) {
      this.isRunning = false;
      console.log("finished executing - stopping");
    }
  }
}
