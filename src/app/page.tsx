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
import Chart from "react-google-charts";
import Image from "next/image";

export default function HomePage() {
	const searchParams = useSearchParams();
	const fullscreen = searchParams ? searchParams.get("fullscreen") : "";
	const defaultTimeSpan = searchParams
		? (searchParams.get("timespan") as TimeSpan)
		: undefined;

	const [windData, setWindData] = useState<WindData | null>(null);

	const [timeSpan, setTimeSpan] = useState<TimeSpan>(defaultTimeSpan ?? "10");
	const [errorVisible, setErrorVisible] = useState<"error" | "no-data" | null>(
		null,
	);
	const [previousAttempt, setPreviousAttempt] = useState<Date | null>(null);

	const refreshWindData = useCallback(
		(overrideTimespan = timeSpan) => {
			if (previousAttempt && Date.now() - previousAttempt.getTime() < 500)
				return;
			setPreviousAttempt(new Date());
			setWindData(null);
			getWindData(parseInt(overrideTimespan))
				.then((wd) => {
					if (errorVisible) setErrorVisible(null);
					setWindData(wd);
					if (
						wd.wind_histogram.length == 0 ||
						wd.maxGust.direction == undefined
					) {
						setErrorVisible("no-data");
					}
				})
				.catch((e) => {
					console.log(e);
					setErrorVisible("error");
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
				className={`container flex flex-col items-center justify-start gap-6 px-3 py-10`}
			>
				<h1 className="flex gap-2 items-center overflow-visible text-4xl font-extrabold tracking-tight text-white sm:text-[3rem]">
					<span className="text-[hsl(0, 0.00%, 100.00%)] mt-6">vind.</span>
					<Image
						src={
							"https://skydiveoppdal.no/wp-content/uploads/2024/05/skydiveoppdal_logo_white.png"
						}
						width={300}
						height={200}
						style={{
							width: "auto",
							height: "auto",
							maxWidth: "250px",
							marginTop: "1rem",
						}}
						alt="SkydiveOppdal logo"
					/>
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

					{/* Preload google charts */}
					<div className="hidden">
						<Chart />
					</div>

					<div className="flex w-full flex-row flex-wrap items-stretch justify-center gap-3">
						<GaugeChartComponent windData={windData} timeSpan={timeSpan} />
						<WindRoseComponent windData={windData} timeSpan={timeSpan} />
					</div>
					<LineChartComponent windData={windData} timeSpan={timeSpan} />
				</div>
			</div>
			{errorVisible !== null && (
				<div
					onClick={() => setErrorVisible(null)}
					className="absolute z-30 flex h-screen w-screen select-none items-start justify-center pt-56"
				>
					<div className="rounded-lg border-2 border-red-700 bg-red-400 p-5 text-center font-bold text-black">
						Error: Kunne ikke hente vinddata
						<br />
						{errorVisible == "no-data" ? (
							<>
								<strong className="text-xl">
									Databasen er tom! <br />
								</strong>
								<br />
								(Databasen er tilgjenglig, men inneholder ingen data...)
								<br />
								Si ifra til en datakyndig i NTNU Fallskjermklubb
							</>
						) : (
							<>Sjekk konsollen for mer info</>
						)}
						<br />
						<br />
						Trykk for å prøve på nytt
					</div>
				</div>
			)}
		</main>
	);
}
