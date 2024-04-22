type DirectionCount = {
  "0-7": number;
  "7-14": number;
  "14-18": number;
  "18+": number;
};

export type CountClassify = "angle" | "0-7" | "7-14" | "14-18" | "18+";

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

export const ChartDefaultProps: ChartPropTypes = {
  width: 600,
  height: 600,
  chartData: [
    {
      angle: "N",
      "0-1": 0.5,
      "1-2": 1.6,
      "2-3": 0.9,
      "3-4": 0.9,
      "4-5": 0.4,
      "5-6": 0.3,
      "6-7": 0.2,
      "7+": 0.1,
      total: 4.8999999999999995,
    },
    {
      angle: "NNE",
      "0-1": 0.6,
      "1-2": 1.8,
      "2-3": 1.3,
      "3-4": 0.8,
      "4-5": 0.5,
      "5-6": 0.3,
      "6-7": 0.1,
      "7+": 0.1,
      total: 5.499999999999999,
    },
    {
      angle: "NE",
      "0-1": 0.5,
      "1-2": 1.5,
      "2-3": 1.6,
      "3-4": 1.2,
      "4-5": 1.2,
      "5-6": 0.6,
      "6-7": 0.1,
      "7+": 0.1,
      total: 6.799999999999999,
    },
    {
      angle: "ENE",
      "0-1": 0.4,
      "1-2": 1.6,
      "2-3": 0.9,
      "3-4": 1,
      "4-5": 0.5,
      "5-6": 0.2,
      "6-7": 0.1,
      "7+": 0.1,
      total: 4.8,
    },
    {
      angle: "E",
      "0-1": 0.4,
      "1-2": 1.6,
      "2-3": 1,
      "3-4": 0.8,
      "4-5": 0.4,
      "5-6": 0.1,
      "6-7": 0.1,
      "7+": 0.1,
      total: 4.499999999999999,
    },
    {
      angle: "ESE",
      "0-1": 0.3,
      "1-2": 1.2,
      "2-3": 0.6,
      "3-4": 0.4,
      "4-5": 0.2,
      "5-6": 0.1,
      "6-7": 0.1,
      "7+": 0.05,
      total: 2.95,
    },
    {
      angle: "SE",
      "0-1": 0.4,
      "1-2": 1.5,
      "2-3": 0.6,
      "3-4": 0.5,
      "4-5": 0.4,
      "5-6": 0.05,
      "6-7": 0.05,
      "7+": 0.05,
      total: 3.5499999999999994,
    },
    {
      angle: "SSE",
      "0-1": 0.4,
      "1-2": 1.7,
      "2-3": 0.9,
      "3-4": 0.5,
      "4-5": 0.4,
      "5-6": 0.1,
      "6-7": 0.05,
      "7+": 0.05,
      total: 4.1,
    },
    {
      angle: "S",
      "0-1": 0.6,
      "1-2": 2.2,
      "2-3": 1.4,
      "3-4": 0.8,
      "4-5": 0.7,
      "5-6": 0.1,
      "6-7": 0.1,
      "7+": 0.05,
      total: 5.949999999999999,
    },
    {
      angle: "SSW",
      "0-1": 0.4,
      "1-2": 2,
      "2-3": 1.7,
      "3-4": 0.9,
      "4-5": 0.6,
      "5-6": 0.2,
      "6-7": 0.05,
      "7+": 0.1,
      total: 5.949999999999999,
    },
    {
      angle: "SW",
      "0-1": 0.5,
      "1-2": 2.3,
      "2-3": 1.9,
      "3-4": 1.3,
      "4-5": 0.7,
      "5-6": 0.3,
      "6-7": 0.2,
      "7+": 0.1,
      total: 7.299999999999999,
    },
    {
      angle: "WSW",
      "0-1": 0.6,
      "1-2": 2.4,
      "2-3": 2.2,
      "3-4": 1.1,
      "4-5": 0.8,
      "5-6": 0.4,
      "6-7": 0.2,
      "7+": 0.1,
      total: 7.800000000000001,
    },
    {
      angle: "W",
      "0-1": 0.6,
      "1-2": 2.3,
      "2-3": 1.8,
      "3-4": 1.2,
      "4-5": 0.9,
      "5-6": 0.9,
      "6-7": 0.4,
      "7+": 0.9,
      total: 9.000000000000002,
    },
    {
      angle: "WNW",
      "0-1": 0.5,
      "1-2": 2.6,
      "2-3": 1.7,
      "3-4": 1.2,
      "4-5": 1,
      "5-6": 0.9,
      "6-7": 0.7,
      "7+": 2.2,
      total: 10.8,
    },
    {
      angle: "NW",
      "0-1": 0.4,
      "1-2": 2.3,
      "2-3": 1.8,
      "3-4": 1.3,
      "4-5": 1,
      "5-6": 0.9,
      "6-7": 0.7,
      "7+": 1.5,
      total: 9.9,
    },
    {
      angle: "NNW",
      "0-1": 0.1,
      "1-2": 0.8,
      "2-3": 0.8,
      "3-4": 1,
      "4-5": 0.7,
      "5-6": 0.3,
      "6-7": 0.4,
      "7+": 0.2,
      total: 4.300000000000001,
    },
  ],
  columns: ["angle", "0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7+"],
  responsive: false,
  legendGap: 10,
};

export type DataType = Record<string, number | null>;

// export type DataTypes = typeof ChartDefaultProps;

interface State {
  width: number;
  height: number;
}

export interface PropType extends State {
  /**
   * Professionals respond to survey of how much they use a K-12 core competancy in each subject
   */
  data: DataType[];
  /**
   * Subjects
   */
  columns: string[];
  /**
   * Subjects colors
   */
  columnsColor: string[];
  /**
   * All core competency
   */
  angles: string[];
  /**
   * Max score
   */
  dataMax: number;
  /**
   * Target data keys
   */
  dataKeys: string[];
  /**
   * Mouse over Path color
   */
  mouseOverColor: string;
  /**
   * Mouse over competency text color
   */
  mouseOverTitleColor: string;
  /**
   * Mouseover survey score text color
   */
  mouseOverSurveyColor: string;
}