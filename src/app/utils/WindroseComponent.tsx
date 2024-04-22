/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { ChartData } from "./WindRoseUtils";
import { Chart } from "./windrose/WindRose";

const WINDROSE_COLS = ["angle", "0-7", "7-14", "14-18", "18+"];

export default function WindroseComponent(windRoseChartData: ChartData[]) {
  if (!windRoseChartData) return null;

  return <Chart chartData={windRoseChartData} columns={WINDROSE_COLS}></Chart>;
}
