import { type Count, Direction } from "./windrose/Types";

const countPush = (count: Count, dir: Direction, speed: number) => {
  if (speed < 7) {
    count[dir]["0-7"]++;
  } else if (speed < 14) {
    count[dir]["7-14"]++;
  } else if (speed < 18) {
    count[dir]["14-18"]++;
  } else {
    count[dir]["18+"]++;
  }
};

export const classifyDir = (direction: number): Direction => {
  if (direction < 0 || direction >= 360) {
    throw new Error("Direction out of valid range (0-359).");
  }
  const dTh = 22.5; //11.25;
  const index = Math.floor((direction + dTh / 2) / dTh);
  const directions = [
    Direction.N,
    Direction.NNE,
    Direction.NE,
    Direction.ENE,
    Direction.E,
    Direction.ESE,
    Direction.SE,
    Direction.SSE,
    Direction.S,
    Direction.SSW,
    Direction.SW,
    Direction.WSW,
    Direction.W,
    Direction.WNW,
    Direction.NW,
    Direction.NNW,
  ];
  return directions[index % 16]!; // Modulo to wrap around
};

type Data = {
  direction: number[];
  speed: number[];
};

export type ChartData = {
  angle: string;
  total: number;
  [key: string]: number | string; // Allow dynamic properties that are numbers or strings
};

export function calculateWindRose(data: Data): ChartData[] {
  /*  console.log("direction", data.direction); */
  if (data.direction.length !== data.speed.length) {
    throw new Error("Direction and speed arrays must be of the same length.");
  }

  const count: Count = Object.fromEntries(
    Object.values(Direction).map((dir) => [
      dir,
      { "0-7": 0, "7-14": 0, "14-18": 0, "18+": 0 },
    ]),
  ) as Count;

  data.direction.forEach((direction, index) => {
    const speed = data.speed[index];
    const dir = classifyDir(direction);
    countPush(count, dir, speed!);
  });

  let maxTotal = 0; // This will keep track of the maximum sum of all percentages

  const chartData = Object.entries(count).map(([key, value]) => {
    const percentages = Object.fromEntries(
      Object.entries(value).map(([range, count]) => [
        range,
        count / (data.direction.length || 1),
      ]), // Prevent division by zero
    );
    const totalPercentage = Object.values(percentages).reduce(
      (sum, percentage) => sum + percentage,
      0,
    );

    maxTotal = Math.max(maxTotal, totalPercentage); // Update maxTotal if this direction's total is higher

    return {
      angle: key,
      ...percentages,
      total: totalPercentage, // This now stores the sum of percentages for each direction
    } as ChartData;
  });

  // Normalize all percentages and total values to scale from 0 to maxTotal
  if (maxTotal > 0) {
    // Ensure there is a valid maxTotal to avoid division by zero
    chartData.forEach((data) => {
      Object.keys(data).forEach((key) => {
        if (key !== "angle") {
          data[key] = (data[key] as number) / maxTotal;
        }
      });
    });
  }

  return chartData;
}
