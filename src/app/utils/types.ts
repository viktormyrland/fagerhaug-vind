export type ReturnData = {
  aggregations: {
    maxGust: {
      value: number;
    };
  };
};

export type WindData = {
  maxGust: {
    value: number;
    direction: number;
    timestamp: Date;
  };
  wind_histogram: WindMinuteInformation[];
};

export type WindMinuteInformation = {
  timestamp: Date;
  avg_wind: number;
  max_gust: {
    value: number;
    direction: number;
    timestamp: Date;
  };
};

export type Angle = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
export type TimeSpan = "60" | "30" | "10";
