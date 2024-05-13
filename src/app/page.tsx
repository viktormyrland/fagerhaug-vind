"use client";
import { useCallback, useEffect, useState } from "react";
import { getWindData } from "../server/WindDataActions";
import { type TimeSpan, type WindData } from "./utils/types";
import "react-dropdown/style.css";
import LineChartComponent from "./components/LineChartComponent";
import GaugeChartComponent from "./components/GaugeChartComponent";
import WindRoseComponent from "./components/WindRoseComponent";
import HeaderComponent from "./components/HeaderComponent";
import { useSearchParams } from "next/navigation";

export default function HomePage() {
  const searchParams = useSearchParams();
  const fullscreen = searchParams.get("fullscreen");
  const defaultTimeSpan = searchParams.get("timespan") as TimeSpan;

  const [windData, setWindData] = useState<WindData | null>(null);

  const [timeSpan, setTimeSpan] = useState<TimeSpan>(defaultTimeSpan ?? "10");
  const [errorVisible, setErrorVisible] = useState(false);
  const [previousAttempt, setPreviousAttempt] = useState<Date | null>(null);

  const refreshWindData = useCallback(
    (overrideTimespan = timeSpan) => {
      if (previousAttempt && Date.now() - previousAttempt.getTime() < 500)
        return;
      setPreviousAttempt(new Date());
      getWindData(parseInt(overrideTimespan))
        .then((wd) => {
          if (errorVisible) setErrorVisible(false);
          setWindData(wd);
        })
        .catch((e) => {
          console.log(e);
          setErrorVisible(true);
        });
    },
    [errorVisible, previousAttempt, timeSpan],
  );

  useEffect(() => {
    refreshWindData();
  }, [refreshWindData]);

  if (fullscreen === "windrose") {
    return (
      <WindRoseComponent windData={windData} timeSpan={timeSpan} fullscreen />
    );
  } else if (fullscreen === "max") {
    return (
      <GaugeChartComponent windData={windData} timeSpan={timeSpan} fullscreen />
    );
  }

  return (
    <main className=" flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div
        className={`container flex flex-col items-center justify-start gap-12 px-3 py-16`}
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-[3rem]">
          Fagerhaug <span className="text-[hsl(280,100%,70%)]">Vind</span>
        </h1>
        <div
          className={`flex h-full w-full flex-col items-center justify-start gap-12 ${errorVisible ? "blur" : ""}`}
        >
          <HeaderComponent
            previousAttempt={previousAttempt}
            timeSpan={timeSpan}
            setTimeSpan={setTimeSpan}
            refreshWindData={refreshWindData}
          />
          <div className="flex w-full flex-row flex-wrap items-stretch justify-center gap-3">
            <GaugeChartComponent windData={windData} timeSpan={timeSpan} />
            <WindRoseComponent windData={windData} timeSpan={timeSpan} />
          </div>
          <LineChartComponent windData={windData} timeSpan={timeSpan} />
          <span className="">
            Laget med{" "}
            <span className="heart cursor-default text-red-500">❤</span> av{" "}
            <a
              className="hover-animate font-bold text-sky-400 hover:text-sky-300"
              href="https://github.com/viktormyrland"
              target="_blank"
              rel="noopener noreferrer"
            >
              Viktor
            </a>
          </span>
        </div>
      </div>
      {errorVisible && (
        <div
          onClick={() => setErrorVisible(false)}
          className="absolute z-30 flex h-screen w-screen select-none items-start justify-center pt-56"
        >
          <div className="rounded-lg border-2 border-red-700 bg-red-400 p-5 text-center font-bold text-black">
            Error: Kunne ikke hente vinddata
            <br />
            Sjekk konsollen for mer info
            <br />
            <br />
            Trykk for å prøve på nytt
          </div>
        </div>
      )}
    </main>
  );
}
