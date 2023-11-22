import { promises as fs } from "fs";

export const writeToFile = async (positionMessage) => {
  var contents = await fs.readFile("./server/positionData.json", {
    encoding: "utf8",
  });

  const Id = positionMessage.sensorId;
  const timestamp = positionMessage.timestampUsec;
  const data3d = positionMessage.data3d;

  const newPositionData = {
    sensorId: Id,
    timestamp: timestamp,
    data3d: data3d,
  };

  var data = JSON.parse(contents);
  if (!data?.positions) {
    data.positions = {};
  }

  if (data.positions[Id]) {
    data.positions[Id].push(newPositionData);
  } else {
    data.positions[Id] = [newPositionData];
  }

  await fs.writeFile(
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
};
