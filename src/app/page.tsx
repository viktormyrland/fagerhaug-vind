"use client";
import { useCallback, useEffect, useState } from "react";
import { getWindData } from "./utils/PageActions";
import { type TimeSpan, type WindData } from "./utils/types";
import { type ChartData, calculateWindRose } from "./utils/WindRoseUtils";
import "react-dropdown/style.css";
import { WindroseChart } from "./utils/windrose/WindRoseChart.component";

const WINDROSE_COLS = ["angle", "0-7", "7-14", "14-18", "18+"];
export default function HomePage() {
  const [windRoseChartData, setWindRoseChartData] = useState<
    ChartData[] | undefined
  >(undefined);
  const [windData, setWindData] = useState<WindData | null>(null);
  const [animationStarted, setAnimationStarted] = useState(false);
  let isAnimation = false;

  const [runwayVisible, setRunwayVisible] = useState(false);

  const handleAnimationStart = () => {
    setAnimationStarted(true);
    isAnimation = true;
    nextAnimationStep(Date.now() - 36 * 60 * 60 * 1000, 30, true);
  };

  const nextAnimationStep = (
    targetMs: number,
    timeSpanMinutes: number,
    override?: boolean,
  ) => {
    if (targetMs > Date.now() || (!isAnimation && !override)) {
      setAnimationStarted(false);
      isAnimation = false;
      return;
    }
    getWindData(Number(targetMs), Number(timeSpanMinutes))
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
        nextAnimationStep(targetMs + 10 * 60 * 1000, timeSpanMinutes);
      })
      .catch((e) => console.log(e));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex  flex-col items-center justify-start gap-12 px-3 py-16 ">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-[3rem]">
          Fagerhaug <span className="text-[hsl(280,100%,70%)]">Vind</span>
        </h1>
        <div className="mx-4 flex flex-row gap-3 rounded-lg bg-white py-2 text-black">
          <button
            className="mx-4 rounded-lg border border-slate-400 bg-white p-4"
            onClick={handleAnimationStart}
            disabled={animationStarted}
          >
            Start animation
          </button>
        </div>

        <div
          className="flex w-full max-w-[400px] select-none items-center overflow-hidden rounded-lg border border-slate-600 bg-white"
          onClick={() => setRunwayVisible(!runwayVisible)}
        >
          {windRoseChartData && (
            <div className="relative max-w-full">
              <h1 className="absolute top-5 w-full text-center text-xl font-bold text-black">
                Vindrose{" "}
                {windData &&
                  new Date(windData.maxGust.timestamp).toLocaleString()}
              </h1>
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
        <span>Laget med ❤ av Viktor</span>
      </div>
    </main>
  );
}
