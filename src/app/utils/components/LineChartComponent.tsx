import React from "react";
import Chart, { type ChartWrapperOptions } from "react-google-charts";
import { type WindData } from "../types";

// Data points above this threshold will have an annotation if the
// value is higher than the value before and after
const ANNOTATION_THRESHOLD = 11;

export default function LineChartComponent({
  windData,
}: {
  windData: WindData | null;
}) {
  if (!windData) return null;

  const data = [
    [
      { type: "date", label: "Tid" },
      { type: "number", label: "Vindkast" },
      { id: "i0", type: "number", role: "interval" },
      { id: "i1", type: "number", role: "interval" },
      { type: "number", label: "Grense", role: "annotation" },
      { type: "string", role: "tooltip", p: { html: true } },
    ],
    ...windData.wind_histogram.map((wei, index) => {
      let annotation = null;
      if (
        wei.max_gust.value >= ANNOTATION_THRESHOLD &&
        (index === 0 ||
          wei.max_gust.value >
            windData.wind_histogram[index - 1]!.max_gust.value) &&
        (index === windData.wind_histogram.length - 1 ||
          wei.max_gust.value >
            windData.wind_histogram[index + 1]!.max_gust.value)
      ) {
        annotation = wei.max_gust.value;
      }

      return [
        new Date(wei.timestamp),
        wei.max_gust.value,
        wei.avg_wind,
        wei.max_gust.value,
        annotation,
        /* `${wei.max_gust.value} kn.`, */
        `<div style="width:180px;padding:5px;color:black;"><strong>Tid:</strong> ${new Date(wei.timestamp).toLocaleTimeString()}<br/><strong>Snittvind:</strong> ${Number(wei.avg_wind).toFixed(1)} kn<br/><strong>Vindkast:</strong> ${wei.max_gust.value} kn</div>`,
      ];
    }),
  ];

  const options: ChartWrapperOptions["options"] = {
    title: "",
    curveType: "function",
    series: {
      0: { color: "#ff0000" },
    },
    intervals: { style: "area" },
    legend: "none",
    focusTarget: "category",
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
        max: Math.max(
          15,
          windData.wind_histogram.reduce((max, current) => {
            return Number(current.max_gust.value) > max
              ? Number(current.max_gust.value)
              : max;
          }, 15) + 1,
        ),
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
    annotations: {
      /* style: "line", */
      textStyle: {
        fontSize: 14,
        color: "#000", // Customize the color of the annotation text here
        auraColor: "none", // Removes the background color around the text
        alwaysOutside: true,
      },
      boxStyle: {
        stroke: "#888", // Grey border
        strokeWidth: 1,
        rx: 3,
        ry: 3,
        gradient: {
          color1: "#d9d92b",
          color2: "#d9d92b",
          x1: "0%",
          y1: "0%",
          x2: "100%",
          y2: "100%",
          useObjectBoundingBoxUnits: true,
        },
      },
    },
  };

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
