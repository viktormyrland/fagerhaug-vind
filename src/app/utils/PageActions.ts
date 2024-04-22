/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use server";
/* import { Client } from "@elastic/elasticsearch"; */
import { type WindData, type WindEntryInformation } from "./types";

const API_KEY = "eDIydF9JNEJFYjYzTXN2YTdKNzQ6S2p0YjRvMHhTNXV1Z2dwWExMUC10QQ==";

const url =
  "https://ba057f35933d4a19af828318d149fe3c.eu-west-1.aws.found.io:443/readings*/_search";

const headers = {
  Accept: "*/*",
  "Content-Type": "application/json",
  Authorization: "ApiKey " + API_KEY,
};
export const getWindData = async (minutes: number) => {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - minutes * 60 * 1000);
  const data = {
    aggs: {
      max_gust: {
        top_hits: {
          size: 1, // We only need the top one document
          sort: [
            {
              gust: {
                order: "desc", // Sort by gust in descending order to get the maximum first
              },
            },
          ],
          _source: {
            includes: ["gust", "direction", "@timestamp"], // Include gust and direction fields in the results
          },
        },
      },
      time_buckets: {
        date_histogram: {
          field: "@timestamp",
          interval: "10s",
          extended_bounds: {
            min: startDate.getTime(),
            max: endDate.getTime(),
          },
          min_doc_count: 0,
        },
        aggs: {
          max_gust: {
            top_hits: {
              size: 1, // We only need the top one document
              sort: [
                {
                  gust: {
                    order: "desc", // Sort by gust in descending order to get the maximum first
                  },
                },
              ],
              _source: {
                includes: ["gust", "direction", "@timestamp"], // Include gust and direction fields in the results
              },
            },
          },
          min_wind: {
            top_hits: {
              size: 1, // We only need the top one document
              sort: [
                {
                  gust: {
                    order: "asc",
                  },
                },
              ],
              _source: {
                includes: ["wind"], // Include gust
              },
            },
          },
          avg_wind: {
            avg: {
              field: "wind",
            },
          },
        },
      },
    },
    size: 0,
    fields: [
      {
        field: "@timestamp",
        format: "date_time",
      },
    ],
    query: {
      bool: {
        must: [],
        filter: [
          {
            match_all: {},
          },
          {
            range: {
              "@timestamp": {
                gte: startDate.toISOString(),
                lte: endDate.toISOString(),
                format: "strict_date_optional_time",
              },
            },
          },
        ],
        should: [],
        must_not: [],
      },
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  const wind_histogram = (
    responseData.aggregations.time_buckets.buckets.map((bucket) => {
      return {
        timestamp: bucket.key_as_string,
        avg_wind: bucket.avg_wind.value,
        max_gust: {
          value: bucket.max_gust.hits.hits[0]
            ? Number(bucket.max_gust.hits.hits[0]._source.gust).toFixed(1)
            : undefined,
          direction: bucket.max_gust.hits.hits[0]
            ? bucket.max_gust.hits.hits[0]._source.direction
            : undefined,
          timestamp: bucket.max_gust.hits.hits[0]
            ? bucket.max_gust.hits.hits[0]._source["@timestamp"]
            : undefined,
        },
      } as WindEntryInformation;
    }) as WindEntryInformation[]
  ).filter(
    (wmi) =>
      wmi.max_gust.direction !== undefined && wmi.max_gust.value !== undefined,
  );

  const returnData = {
    maxGust: {
      value: Number(
        responseData.aggregations.max_gust.hits.hits[0]._source.gust,
      ).toFixed(1),
      direction:
        responseData.aggregations.max_gust.hits.hits[0]._source.direction,
      timestamp:
        responseData.aggregations.max_gust.hits.hits[0]._source["@timestamp"],
    },
    wind_histogram,
    timestamp: new Date(),
  };
  /* console.log(returnData); */

  return returnData as WindData;
};
