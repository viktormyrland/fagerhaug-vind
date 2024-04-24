import React from "react";
import Chart, { type ChartWrapperOptions } from "react-google-charts";
import { type TimeSpan, type WindData } from "../types";

interface GaugeChartProps {
  windData: WindData | null;
  timeSpan: TimeSpan;
}

export default function GaugeChartComponent({
  windData,
  timeSpan,
}: GaugeChartProps) {
  return (
    <div className="relative flex w-[400px] select-none flex-col items-center overflow-hidden rounded-lg border border-slate-600 bg-white text-black">
      <h1 className="z-20 mt-4 w-full text-center text-lg font-bold text-black">
        Maks vindkast siste {timeSpan} minutter
      </h1>
      <GaugeChart windData={windData} />

      <strong>Tidspunkt:</strong>
      <span>
        {windData && new Date(windData.maxGust.timestamp).toLocaleTimeString()}{" "}
        {windData &&
          `(${Math.round((Date.now() - new Date(windData.maxGust.timestamp).getTime()) / 1000 / 60)} min siden)`}
      </span>
      <strong>Retning:</strong>
      <span>
        {windData?.maxGust.direction}° (
        {windData && degreesToCardinal(windData.maxGust.direction)}){" "}
      </span>
    </div>
  );
}
function GaugeChart({ windData }: { windData: WindData | null }) {
  const options: ChartWrapperOptions["options"] = {
    width: 350,
    height: 350,
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
      width="350px"
      height="350px"
      data={data}
      options={options}
    />
  );
}

function degreesToCardinal(d: number) {
  const directions = ["N", "NØ", "Ø", "SØ", "S", "SV", "V", "NV"];
  const index = Math.round(d / 45) % 8;
  return directions[index];
}
