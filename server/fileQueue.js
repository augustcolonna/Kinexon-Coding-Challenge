// class fileQueue {
//   constructor() {
//     this.Queue = [];
//     this.headIndex = 0;
//     this.tailIndex = 0;
//   }

//   enqueue(item) {
//     if (item) {
//       this.Queue[this.tailIndex] = item;
//       this.tailIndex++;
//     } else {
//       throw new Error("Unable to Queue");
//     }
//   }

//   dequeue() {
//     let sendToJson = this.items[this.headIndex];
//     this.headIndex++;
//     writeToFunction(sendToJson)

//   }

//   isEmpty() {
//     if (this.tailIndex - this.headIndex == 0) {
//       return true;
//     } else {
//       return false;
//     }
//   }

// }

// export { fileQueue };
class fileQueue {
  constructor() {
    this.Queue = [];
    this.isRunning = false;
  }

  async start() {
    setInterval(() => {
      console.log(this.Queue.length);

      if (this.Queue.length > 0) {
        console.log(this.isRunning);
        this.isRunning = true;
        while (this.Queue.length > 0) {
          console.log("xxxxx");
          this.execute();
        }
        this.isRunning = false;
      }
    }, 5000);
  }

  isEmpty() {
    if (this.Queue.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  async enQueue(item) {
    if (item) {
      this.Queue.push(item);
    } else {
      throw new Error("Unable to Queue");
    }
  }

  execute = () => {
    setTimeout(() => {
      console.log(this.isEmpty());
      if (this.isEmpty()) {
        this.isRunning = false;
        console.log("is empty");
        return;
      }

      if (this.isRunning) {
        console.log("is running");
        return;
      }

      this.isRunning = true;
      const item = this.Queue.shift();
      writeToFunction(item);
      console.log("item removed from queue", this.Queue.length);
    }, 500);
  };
}
