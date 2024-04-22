"use client";
import { useCallback, useEffect, useState } from "react";
import { getWindData } from "./utils/PageActions";
import { type TimeSpan, type WindData } from "./utils/types";
import { type ChartData, calculateWindRose } from "./utils/WindRoseUtils";
import Dropdown, { type Option } from "react-dropdown";
import { Chart } from "./utils/windrose";
import "react-dropdown/style.css";

const WINDROSE_COLS = ["angle", "0-7", "7-14", "14-18", "18+"];
export default function HomePage() {
  const [windData, setWindData] = useState<WindData | null>(null);
  const [windRoseChartData, setWindRoseChartData] = useState<
    ChartData[] | undefined
  >(undefined);
  const [timeSpan, setTimeSpan] = useState<TimeSpan>("10");

  const refreshWindData = useCallback(
    (overrideTimespan = timeSpan) => {
      getWindData(parseInt(overrideTimespan))
        .then((wd) => {
          const direction: number[] = [];
          const speed: number[] = [];

          wd.wind_histogram.forEach((wmi) => {
            direction.push(wmi.max_gust.direction);
            speed.push(wmi.max_gust.value);
          });

          const chartData = calculateWindRose({ direction, speed });

          setWindRoseChartData(chartData);
          setWindData(wd);
        })
        .catch((e) => console.log(e));
    },
    [timeSpan],
  );

  useEffect(() => {
    refreshWindData();
  }, [refreshWindData]);

  function degreesToCardinal(d: number) {
    const directions = ["N", "NØ", "Ø", "SØ", "S", "SV", "V", "NV"];
    const index = Math.round(d / 45) % 8; // There are 360/22.5 = 16 segments
    return directions[index];
  }

  const handleSelectTimespan = (o: Option) => {
    setTimeSpan(o.value as TimeSpan);
    refreshWindData(o.value as TimeSpan);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-start gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Fagerhaug <span className="text-[hsl(280,100%,70%)]">Vind</span>
        </h1>
        <Dropdown
          options={["10", "30", "60"]}
          onChange={handleSelectTimespan}
          value={timeSpan}
          placeholder="Select a timespan"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <div className="text-lg">
            Max gust knots: {windData?.maxGust.value} knots
          </div>
          <div className="text-lg">
            Max gust direction: {windData?.maxGust.direction}° (
            {windData && degreesToCardinal(windData.maxGust.direction)})
          </div>
          <div className="text-lg">
            Max gust time:{" "}
            {windData &&
              new Date(windData.maxGust.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <div className="flex h-[550px] w-[600px] justify-center bg-white">
          {windRoseChartData && (
            <Chart
              chartData={windRoseChartData}
              columns={WINDROSE_COLS}
              width={600}
              height={500}
              legendGap={0}
              responsive={false}
            ></Chart>
          )}
        </div>
      </div>
    </main>
  );
}
