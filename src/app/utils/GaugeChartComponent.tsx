import React from "react";
import Chart, { type ChartWrapperOptions } from "react-google-charts";
import { type WindData } from "./types";

export default function GaugeChartComponent({
  windData,
}: {
  windData: WindData | null;
}) {
  const options: ChartWrapperOptions["options"] = {
    width: 250,
    height: 250,
    redFrom: 18,
    redTo: 25,
    yellowFrom: 14,
    yellowTo: 18,
    minorTicks: 5,
    max: 25,
  };

  if (!windData) return null;

  const data = [
    ["", "Label"],
    ["", Number(windData.maxGust.value)],
  ];

  return (
    <Chart
      chartType="Gauge"
      width="250px"
      height="250px"
      data={data}
      options={options}
    />
  );
}
