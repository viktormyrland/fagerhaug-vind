type DirectionCount = {
  "0-5": number;
  "5-10": number;
  "10-14": number;
  "14-18": number;
  "18-22": number;
  "22+": number;
};

export type CountClassify = "angle" | "0-7" | "7-14" | "14-18" | "18-22" | "22+";

export enum Direction {
  N = "N",
  NNE = "NNE",
  NE = "NE",
  ENE = "ENE",
  E = "E",
  ESE = "ESE",
  SE = "SE",
  SSE = "SSE",
  S = "S",
  SSW = "SSW",
  SW = "SW",
  WSW = "WSW",
  W = "W",
  WNW = "WNW",
  NW = "NW",
  NNW = "NNW",
}

export type Count = {
  N: DirectionCount;
  NNE: DirectionCount;
  NE: DirectionCount;
  ENE: DirectionCount;
  E: DirectionCount;
  ESE: DirectionCount;
  SE: DirectionCount;
  SSE: DirectionCount;
  S: DirectionCount;
  SSW: DirectionCount;
  SW: DirectionCount;
  WSW: DirectionCount;
  W: DirectionCount;
  WNW: DirectionCount;
  NW: DirectionCount;
  NNW: DirectionCount;
};

export type DataTypes = Record<string, number>[];

export type ChartData = {
  angle: string;
  total: number;
  [key: string]: number | string; // Allow dynamic properties that are numbers or strings
};

export type Column = keyof ChartData;

export interface ChartPropTypes extends React.HTMLProps<HTMLDivElement> {
  // data: DirectionCount & { angle: Direction; total: number }[];
  chartData: ChartData[];
  // columns: string[];
  columns: string[];
  width: number;
  height: number;
  responsive: boolean;
  legendGap: number;
}

export type DataType = Record<string, number | null>;
