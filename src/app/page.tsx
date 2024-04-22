"use client";
import { useCallback, useEffect, useState } from "react";
import { getWindData } from "./utils/PageActions";
import { type TimeSpan, type WindData } from "./utils/types";
import { type ChartData, calculateWindRose } from "./utils/WindRoseUtils";
import Dropdown, { type Option } from "react-dropdown";
import { WindroseChart } from "./utils/windrose";
import "react-dropdown/style.css";
import LineChartComponent from "./utils/LineChartComponent";
import GaugeChartComponent from "./utils/GaugeChartComponent";

const WINDROSE_COLS = ["angle", "0-7", "7-14", "14-18", "18+"];
export default function HomePage() {
  const [windData, setWindData] = useState<WindData | null>(null);
  const [windRoseChartData, setWindRoseChartData] = useState<
    ChartData[] | undefined
  >(undefined);
  const [timeSpan, setTimeSpan] = useState<TimeSpan>("10");
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState<number | null>(
    null,
  );

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

  useEffect(() => {
    // Function to update the elapsed time
    const updateSeconds = () => {
      if (!windData) return;
      const now = new Date();
      const previous = new Date(windData.timestamp);
      const milliseconds = now.getTime() - previous.getTime();
      const newSeconds = Math.floor(milliseconds / 1000);
      setSecondsSinceUpdate(newSeconds);

      if (newSeconds >= 10) {
        refreshWindData();
        return;
      }
    };

    // Call the function once on mount to initialize the seconds state
    updateSeconds();

    // Set up an interval to update the seconds every second
    const intervalId = setInterval(updateSeconds, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [windData, refreshWindData]); // Depend on `previousDate` to reset the interval if it changes

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
      <div className="container flex  flex-col items-center justify-start gap-12 px-3 py-16 ">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-[3rem]">
          Fagerhaug <span className="text-[hsl(280,100%,70%)]">Vind</span>
        </h1>
        <div className="mx-4 flex flex-row gap-3 rounded-lg bg-white py-2 text-black">
          <div className="flex items-center gap-3 rounded pl-3 ">
            Antall minutter:
            <Dropdown
              options={["10", "30", "60"]}
              onChange={handleSelectTimespan}
              value={timeSpan}
              placeholder="Select a timespan"
            />
          </div>
          <div className="mr-3 flex w-[12rem] items-center">
            Oppdateres om
            <span className="ml-1">
              {secondsSinceUpdate ? Math.max(10 - secondsSinceUpdate, 0) : 10}s
            </span>
          </div>
        </div>
        <div className="flex w-full flex-row flex-wrap items-start justify-center gap-3">
          <div className="relative flex w-[300px] flex-col items-center overflow-hidden rounded-lg border border-slate-600 bg-white text-black">
            <h1 className="z-20 w-full text-center text-lg font-bold text-black">
              Maks vindkast siste {timeSpan} minutter
            </h1>
            <GaugeChartComponent windData={windData ?? null} />

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
          <div className="flex w-full max-w-[600px] items-center overflow-hidden rounded-lg border border-slate-600 bg-white">
            {windRoseChartData && (
              <div className="relative w-full max-w-[600px]">
                <h1 className="absolute top-5 w-full text-center text-xl font-bold text-black">
                  Vindrose siste {timeSpan} minutter
                </h1>
                <WindroseChart
                  chartData={windRoseChartData}
                  columns={WINDROSE_COLS}
                  width={600}
                  height={700}
                  legendGap={0}
                  responsive={true}
                ></WindroseChart>
              </div>
            )}
          </div>
        </div>
        <div className="relative flex w-full overflow-hidden rounded-lg border border-slate-600">
          <h1 className="absolute top-5 z-20 w-full text-center text-xl font-bold text-black">
            Vindgraf siste {timeSpan} minutter
          </h1>
          <LineChartComponent windData={windData?.wind_histogram ?? null} />
        </div>
        <span>Laget med ❤ av Viktor</span>
      </div>
    </main>
  );
}
