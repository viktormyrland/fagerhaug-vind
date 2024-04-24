import React, { useState } from "react";
import { calculateWindRose, type ChartData } from "../utils/WindRoseUtils";
import { type TimeSpan, type WindData } from "../utils/types";
import { WindroseChart } from "../utils/windrose/WindRoseChart.component";

const WINDROSE_COLS = ["angle", "0-5", "5-10", "10-14", "14-18", "18+"];

interface WindRoseProps {
  windData: WindData | null;
  timeSpan: TimeSpan;
}

export default function WindRoseComponent({
  windData,
  timeSpan,
}: WindRoseProps) {
  const [runwayVisible, setRunwayVisible] = useState(false);
  /* const [windRoseChartData, setWindRoseChartData] = useState<
    ChartData[] | undefined
  >(undefined); */

  const direction: number[] = [];
  const speed: number[] = [];

  if (windData)
    windData.wind_histogram.forEach((wmi) => {
      direction.push(wmi.max_gust.direction);
      speed.push(wmi.max_gust.value);
    });

  const windRoseChartData: ChartData[] | undefined = windData
    ? calculateWindRose({
        direction,
        speed,
      })
    : undefined;

  return (
    <div
      className="flex w-full max-w-[400px] cursor-pointer select-none items-center overflow-hidden rounded-lg border border-slate-600 bg-white"
      onClick={() => setRunwayVisible(!runwayVisible)}
    >
      <div className="relative max-w-full">
        <h1 className="absolute top-5 w-full text-center text-xl font-bold text-black">
          Vindrose siste {timeSpan} minutter
        </h1>
        {runwayVisible && (
          <div
            className="absolute left-1/2 top-1/2 z-30 flex h-[70%] w-8 flex-col items-center justify-between bg-black opacity-20"
            style={{
              transform: "translate(-50%, -50%) rotate(70deg) ",
              transformOrigin: "center",
            }}
          >
            <div className="mt-3 flex w-[80%] flex-row justify-between">
              <div className="h-10 w-1 bg-white" />
              <div className="mr-1 h-10 w-1 bg-white" />
              <div className="h-10 w-1 bg-white" />
              <div className="h-10 w-1 bg-white" />
            </div>

            <div className="flex w-[70%] flex-row justify-between">
              <div className="h-10 w-1 bg-white" />
              <div className="h-10 w-1 bg-white" />
            </div>

            <div className="mb-3 flex w-[80%] flex-row justify-between">
              <div className="h-10 w-1 bg-white" />
              <div className="mr-1 h-10 w-1 bg-white" />
              <div className="h-10 w-1 bg-white" />
              <div className="h-10 w-1 bg-white" />
            </div>
          </div>
        )}
        {windRoseChartData ? (
          <WindroseChart
            chartData={windRoseChartData}
            columns={WINDROSE_COLS}
            legendGap={0}
            width={400}
            height={400}
            responsive={true}
          />
        ) : (
          <div className="h-[600px] w-[400px]"></div>
        )}
      </div>
    </div>
  );
}
