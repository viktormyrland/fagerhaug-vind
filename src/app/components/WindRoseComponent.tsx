import React, { useEffect, useState } from "react";
import { calculateWindRose, type ChartData } from "../utils/WindRoseUtils";
import { type TimeSpan, type WindData } from "../utils/types";
import { WindroseChart } from "../utils/windrose/WindRoseChart.component";
import { Skeleton } from "@mui/material";

const WINDROSE_COLS = [
	"angle",
	"0-5",
	"5-10",
	"10-14",
	"14-18",
	"18-22",
	"22+",
];

interface WindRoseProps {
	windData: WindData | null;
	timeSpan: TimeSpan;
	fullscreen?: boolean;
}

export default function WindRoseComponent({
	windData,
	timeSpan,
	fullscreen,
}: WindRoseProps) {
	const [runwayVisible, setRunwayVisible] = useState(true);
	/* const [windRoseChartData, setWindRoseChartData] = useState<
	ChartData[] | undefined
  >(undefined); */

	const direction: number[] = [];
	const speed: number[] = [];

	const [fullscreenMaxDimensions, setFullscreenMaxDimensions] = useState([
		350, 350,
	]);
	const [showSkeleton, setShowSkeleton] = useState(true);
	useEffect(() => {
		if (windData) {
			const timer = setTimeout(() => {
				setShowSkeleton(false);
			}, 100);

			// Clear the timer if the component unmounts before the timer completes
			return () => clearTimeout(timer);
		}
	}, [windData]);

	useEffect(() => {
		setFullscreenMaxDimensions([
			Math.min(window.innerWidth * 1.4, window.innerHeight),
			Math.min(window.innerHeight / 1.4, window.innerWidth),
		]);
	}, []);

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
			className={`flex w-full ${fullscreen ? "max-w-screen justify-center" : "max-w-[400px] border border-slate-600"} cursor-pointer select-none items-center overflow-hidden rounded-lg  bg-white`}
			onClick={() => setRunwayVisible(!runwayVisible)}
		>
			<div className="relative max-w-full">
				<h1 className="absolute top-5 w-full text-center text-xl font-bold text-black">
					Vindrose siste {timeSpan} minutter
				</h1>
				{windRoseChartData && !showSkeleton && runwayVisible && (
					<div
						className="absolute left-1/2 top-1/2 z-30 flex h-[70%] w-8 flex-col items-center justify-between bg-black opacity-20"
						style={{
							transform: "translate(-50%, -50%) rotate(70deg) ",
							transformOrigin: "center",
						}}
					>
						<div className="mt-3 w-[80%] flex-col gap-1">
							<div className="flex w-full flex-row justify-between">
								<div className="h-10 w-1 bg-white" />
								<div className="mr-1 h-10 w-1 bg-white" />
								<div className="h-10 w-1 bg-white" />
								<div className="h-10 w-1 bg-white" />
							</div>
							<p style={{ rotate: "180deg", textAlign: "center", fontFamily: "monospace", fontSize: "1.2rem", lineHeight: "40px" }}>25</p>
						</div>

						<div className="flex w-[70%] flex-row justify-between">
							<div className="h-10 w-1 bg-white" />
							<div className="h-10 w-1 bg-white" />
						</div>

						<div className="mb-3 w-[80%] flex-col gap-1">
							<p style={{ textAlign: "center", fontFamily: "monospace", fontSize: "1.2rem", lineHeight: "40px" }}>07</p>
							<div className="flex w-full flex-row justify-between">
								<div className="h-10 w-1 bg-white" />
								<div className="mr-1 h-10 w-1 bg-white" />
								<div className="h-10 w-1 bg-white" />
								<div className="h-10 w-1 bg-white" />
							</div>
						</div>
					</div>
				)}
				{windRoseChartData && !showSkeleton ? (
					<WindroseChart
						chartData={windRoseChartData}
						columns={WINDROSE_COLS}
						legendGap={0}
						width={fullscreen ? fullscreenMaxDimensions[1]! : 400}
						height={fullscreen ? fullscreenMaxDimensions[0]! : 400}
						responsive={true}
					/>
				) : (
					<div className="relative mb-[20px] h-[540px] w-[400px]">
						<div className="absolute top-0 flex h-full w-full items-center justify-center">
							<Skeleton
								variant="circular"
								animation="wave"
								width={400}
								height={400}
							/>
						</div>
						<div className="absolute top-0 flex h-full w-full items-center justify-center">
							<div className="size-[340px] rounded-full bg-white" />
						</div>
						<div className="absolute top-0 flex h-full w-full items-center justify-center">
							<Skeleton
								variant="circular"
								animation="wave"
								width={280}
								height={280}
							/>
						</div>
						<div className="absolute top-0 flex h-full w-full items-end justify-center pl-[170px]">
							<div className="h-[130px] w-[120px] rounded-sm bg-white" />
						</div>
						<div className="absolute top-0 flex h-full w-full items-end justify-center pl-[170px]">
							<Skeleton
								variant="rounded"
								animation="wave"
								width={100}
								height={120}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
