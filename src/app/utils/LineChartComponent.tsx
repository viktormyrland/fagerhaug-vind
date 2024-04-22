import React from "react";
import Chart, { type ChartWrapperOptions } from "react-google-charts";
import { type WindEntryInformation } from "./types";

export default function LineChartComponent({
  windData,
}: {
  windData: WindEntryInformation[] | null;
}) {
  const options: ChartWrapperOptions["options"] = {
    title: "",
    curveType: "function",
    series: [{ color: "#ff0000" }],
    intervals: { style: "area" },
    legend: "none",
    hAxis: {
      slantedText: true,
      slantedTextAngle: 45,
      format: "HH:mm",
    },
    vAxis: {
      format: "# kn",
      minValue: 0,
      viewWindow: {
        min: 0,
        max: windData
          ? Math.max(
              15,
              windData.reduce((max, current) => {
                return current.max_gust.value > max
                  ? current.max_gust.value
                  : max;
              }, 0),
            )
          : 15,
      },
    },
    tooltip: {
      isHtml: true,
    },
    chartArea: {
      width: "100%",
      left: 50,
      right: 10,
    },
  };

  if (!windData) return null;

  const data = [
    [
      { type: "date", label: "Tid" },
      /* { type: "number", label: "Snitt vind" }, */
      { type: "number", label: "Vindkast" },
      { id: "i0", type: "number", role: "interval" },
      { id: "i1", type: "number", role: "interval" },
      { type: "string", role: "tooltip", p: { html: true } }, // Tooltip column
    ],
    ...windData.map((wei) => {
      return [
        new Date(wei.timestamp),
        /* wei.avg_wind, */
        wei.max_gust.value,
        wei.avg_wind,
        wei.max_gust.value,
        `<div style="width:150px;padding:5px;color:black;"><strong>Tid:</strong> ${new Date(wei.timestamp).toLocaleTimeString()}<br/><strong>Vind:</strong> ${Number(wei.avg_wind).toFixed(1)} kn<br/><strong>Vindkast:</strong> ${wei.max_gust.value} kn</div>`,
      ];
    }),
  ];

  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}
