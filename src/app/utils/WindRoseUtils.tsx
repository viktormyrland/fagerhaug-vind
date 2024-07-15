import { type Count, Direction } from "./windrose/WindRoseChart.types";

const countPush = (count: Count, dir: Direction, speed: number) => {
  if (speed < 5) {
    count[dir]["0-5"]++;
  } else if (speed < 10) {
    count[dir]["5-10"]++;
  } else if (speed < 14) {
    count[dir]["10-14"]++;
  } else if (speed < 18) {
    count[dir]["14-18"]++;
  } else if (speed < 22) {
    count[dir]["18-22"]++;
  } else {
    count[dir]["22+"]++;
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
  [key: string]: number | string;
};

export function calculateWindRose(data: Data): ChartData[] {
  if (data.direction.length !== data.speed.length) {
    throw new Error("Direction and speed arrays must be of the same length.");
  }

  const count: Count = Object.fromEntries(
    Object.values(Direction).map((dir) => [
      dir,
      { "0-5": 0, "5-10": 0, "10-14": 0, "14-18": 0, "18-22": 0, "22+": 0 },
    ]),
  ) as Count;

  data.direction.forEach((direction, index) => {
    const speed = data.speed[index];
    const dir = classifyDir(direction);
    countPush(count, dir, speed!);
  });

  let maxTotal = 0;

  const chartData = Object.entries(count).map(([key, value]) => {
    const percentages = Object.fromEntries(
      Object.entries(value).map(([range, count]) => [
        range,
        count / (data.direction.length || 1),
      ]),
    );
    const totalPercentage = Object.values(percentages).reduce(
      (sum, percentage) => sum + percentage,
      0,
    );

    maxTotal = Math.max(maxTotal, totalPercentage);

    return {
      angle: key,
      ...percentages,
      total: totalPercentage,
    } as ChartData;
  });

  if (maxTotal > 0) {
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
