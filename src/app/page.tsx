"use client";
import { useCallback, useEffect, useState } from "react";
import { getWindData } from "./utils/PageActions";
import { type TimeSpan, type WindData } from "./utils/types";
import { type ChartData, calculateWindRose } from "./utils/WindRoseUtils";
import Dropdown, { type Option } from "react-dropdown";
import "react-dropdown/style.css";
import LineChartComponent from "./utils/LineChartComponent";
import GaugeChartComponent from "./utils/GaugeChartComponent";
import { WindroseChart } from "./utils/windrose/WindRoseChart.component";

const WINDROSE_COLS = ["angle", "0-7", "7-14", "14-18", "18+"];
export default function HomePage() {
  const [windData, setWindData] = useState<WindData | null>(null);
  const [windRoseChartData, setWindRoseChartData] = useState<
    ChartData[] | undefined
  >(undefined);
  const [timeSpan, setTimeSpan] = useState<TimeSpan>("10");

  const [runwayVisible, setRunwayVisible] = useState(false);

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
      <div className="container flex flex-col items-center justify-start gap-12 px-3 py-16 ">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-[3rem]">
          Fagerhaug <span className="text-[hsl(280,100%,70%)]">Vind</span>
        </h1>
        <div className="mx-4 flex flex-row flex-wrap justify-center gap-3 rounded-lg bg-white py-2 text-black">
          <div className="flex items-center gap-3 rounded pl-3 ">
            Antall minutter:
            <Dropdown
              options={["10", "30", "60"]}
              onChange={handleSelectTimespan}
              value={timeSpan}
              placeholder="Select a timespan"
            />
          </div>
          <SecondsSinceUpdateComponent
            refreshWindData={refreshWindData}
            windData={windData}
          />
        </div>
        <div className="flex w-full flex-row flex-wrap items-stretch justify-center gap-3">
          <div className="relative flex w-[400px] select-none flex-col items-center overflow-hidden rounded-lg border border-slate-600 bg-white text-black">
            <h1 className="z-20 mt-4 w-full text-center text-lg font-bold text-black">
              Maks vindkast siste {timeSpan} minutter
            </h1>
            <GaugeChartComponent windData={windData} />

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
          <div
            className="flex w-full max-w-[400px] cursor-pointer select-none items-center overflow-hidden rounded-lg border border-slate-600 bg-white"
            onClick={() => setRunwayVisible(!runwayVisible)}
          >
            {windRoseChartData && (
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
                <WindroseChart
                  chartData={windRoseChartData}
                  columns={WINDROSE_COLS}
                  legendGap={0}
                  width={400}
                  height={400}
                  responsive={true}
                />
              </div>
            )}
          </div>
        </div>
        <div className="relative flex w-full select-none overflow-hidden rounded-lg border border-slate-600">
          <h1 className="absolute top-5 z-20 w-full text-center text-xl font-bold text-black">
            Vindgraf siste {timeSpan} minutter
          </h1>
          <LineChartComponent windData={windData} />
        </div>
        <span>
          Laget med ❤ av{" "}
          <a
            className="font-bold text-sky-400"
            href="https://github.com/viktormyrland"
            target="_blank"
            rel="noopener noreferrer"
          >
            Viktor
          </a>
        </span>
      </div>
    </main>
  );
}

const SecondsSinceUpdateComponent = ({
  windData,
  refreshWindData,
}: {
  windData: WindData | null;
  refreshWindData: () => void;
}) => {
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState<number | null>(
    null,
  );

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
  }, [refreshWindData, windData]); // Depend on `previousDate` to reset the interval if it changes

  return (
    <div className="mr-3 flex w-[12rem] items-center justify-center">
      Oppdateres om
      {windData && (
        <span className="ml-1">
          {secondsSinceUpdate ? Math.max(10 - secondsSinceUpdate, 0) : 10}s
        </span>
      )}
    </div>
  );
};
