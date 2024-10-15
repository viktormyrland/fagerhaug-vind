import React, { useEffect, useState } from "react";
import Chart, { type ChartWrapperOptions } from "react-google-charts";
import { type TimeSpan, type WindData } from "../utils/types";
import { Skeleton } from "@mui/material";

interface GaugeChartProps {
  windData: WindData | null;
  timeSpan: TimeSpan;
  fullscreen?: boolean;
}

export default function GaugeChartComponent({
  windData,
  timeSpan,
  fullscreen,
}: GaugeChartProps) {
  const [fullscreenMaxDimensions, setFullscreenMaxDimensions] = useState([
    350, 350,
  ]);

  useEffect(() => {
    setFullscreenMaxDimensions([
      Math.min(window.innerWidth * 1.4, window.innerHeight),
      Math.min(window.innerHeight / 1.4, window.innerWidth),
    ]);
  }, []);
  return (
    <div
      className={`relative flex ${fullscreen ? "h-screen" : "w-[400px] border border-slate-600"} select-none flex-col items-center overflow-hidden rounded-lg  bg-white text-black`}
    >
      <h1 className=" mt-4 w-full text-center text-lg font-bold text-black">
        Maks vindkast siste {timeSpan} minutter
      </h1>
      {windData ? (
        <div className="relative flex flex-col items-center">
          <GaugeChart
            windData={windData}
            fullscreen={fullscreen}
            fullscreenMaxDimensions={fullscreenMaxDimensions}
          />

          <strong>Tidspunkt:</strong>
          <span>
            {windData &&
              new Date(windData.maxGust.timestamp).toLocaleTimeString()}{" "}
            {windData &&
              `(${Math.round((Date.now() - new Date(windData.maxGust.timestamp).getTime()) / 1000 / 60)} min siden)`}
          </span>
          <strong>Retning:</strong>
          <span>
            {windData?.maxGust.direction}° (
            {windData && degreesToCardinal(windData.maxGust.direction)}){" "}
          </span>
        </div>
      ) : (
        <div className="relative mb-[10px] h-[440px] w-[350px]">
          <div className="absolute flex h-full w-full items-start justify-center pt-[10px]">
            <Skeleton
              variant="circular"
              animation="wave"
              width={320}
              height={320}
            />
          </div>
          <div className="absolute flex h-full w-full items-end justify-center">
            <Skeleton
              variant="rounded"
              animation="wave"
              width={200}
              height={90}
            />
          </div>
        </div>
      )}
    </div>
  );
}
function GaugeChart({
  windData,
  fullscreen,
  fullscreenMaxDimensions,
}: {
  windData: WindData | null;
  fullscreen?: boolean;
  fullscreenMaxDimensions: number[];
}) {
  const options: ChartWrapperOptions["options"] = {
    width: fullscreen ? fullscreenMaxDimensions[1] : 350,
    height: fullscreen ? fullscreenMaxDimensions[0] : 350,
    redFrom: 22,
    redTo: 24,
    yellowFrom: 18,
    yellowTo: 22,
    minorTicks: 6,
    max: 24,
  };

  if (!windData) return null;

  const data = [
    ["", "Label"],
    ["", Number(windData.maxGust.value)],
  ];

  return (
    <Chart
      chartType="Gauge"
      width={`${fullscreen ? fullscreenMaxDimensions[1] : 350}px`}
      height={`${fullscreen ? fullscreenMaxDimensions[0] : 350}px`}
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
