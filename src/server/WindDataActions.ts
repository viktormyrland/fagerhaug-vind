"use server";
import { type WindData } from "../app/utils/types";

const API_KEY: string = process.env.API_KEY!;
const API_URL: string = process.env.API_URL!;
const DATA_INTERVAL = "10s";

const HTTP_HEADERS = {
  Accept: "*/*",
  "Content-Type": "application/json",
  Authorization: "ApiKey " + API_KEY,
};

/**
 * Queries the elasticsearch database reachable at `API_URL` with `API_KEY` to
 * retrieve wind data of the past specified minutes.
 *
 * @param minutes The amount of minutes since now to retrieve data
 * @returns A WindData object containing Wind Data
 */
export const getWindData = async (minutes: number) => {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - minutes * 60 * 1000);

  const elasticsearch_query = {
    aggs: {
      /**
       * max_gust
       * Sort wind data by gust in descending order, get the first result and return gust, direciton and timestamp
       */
      max_gust: {
        top_hits: {
          size: 1,
          sort: [
            {
              gust: {
                order: "desc",
              },
            },
          ],
          _source: {
            includes: ["gust", "direction", "@timestamp"],
          },
        },
      },
      /**
       * time_buckets
       * Get an array of all wind data between `startDate` and `endDate`, in intervals specified by `DATA_INTERVAL`
       */
      time_buckets: {
        date_histogram: {
          field: "@timestamp",
          interval: DATA_INTERVAL,
          extended_bounds: {
            min: startDate.getTime(),
            max: endDate.getTime(),
          },
          min_doc_count: 0,
        },
        // For each interval
        aggs: {
          /**
           * max_gust
           * Get the max gust during this interval, and include the exact timestamp and direction of the gust
           */
          max_gust: {
            top_hits: {
              size: 1,
              sort: [
                {
                  gust: {
                    order: "desc",
                  },
                },
              ],
              _source: {
                includes: ["gust", "direction", "@timestamp"],
              },
            },
          },
          /**
           * avg_wind
           * Get the average wind speed during this interval
           */
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
    /**
     * Limit the query by `startDate` and `endDate`
     */
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

  const response = await fetch(API_URL, {
    method: "POST",
    headers: HTTP_HEADERS,
    body: JSON.stringify(elasticsearch_query),
  });

  const responseData = (await response.json()) as ResponseData;

  const wind_histogram = responseData.aggregations.time_buckets.buckets
    .map((bucket) => {
      return {
        timestamp: new Date(bucket.key_as_string),
        avg_wind: bucket.avg_wind.value,
        max_gust: {
          value: Number(
            Number(
              bucket.max_gust.hits.hits[0]
                ? bucket.max_gust.hits.hits[0]._source.gust
                : 0,
            ).toFixed(1),
          ),
          direction: bucket.max_gust.hits.hits[0]
            ? bucket.max_gust.hits.hits[0]._source.direction
            : undefined,
          timestamp: bucket.max_gust.hits.hits[0]
            ? bucket.max_gust.hits.hits[0]._source["@timestamp"]
            : undefined,
        },
      };
    })
    .filter(
      (wmi) =>
        wmi.max_gust.direction !== undefined &&
        wmi.max_gust.value !== undefined,
    );

  const returnData = {
    maxGust: {
      value: Number(
        Number(
          responseData.aggregations.max_gust.hits.hits[0]
            ? responseData.aggregations.max_gust.hits.hits[0]._source.gust
            : 0,
        ).toFixed(1),
      ),
      direction: responseData.aggregations.max_gust.hits.hits[0]
        ? responseData.aggregations.max_gust.hits.hits[0]._source.direction
        : undefined,
      timestamp: responseData.aggregations.max_gust.hits.hits[0]
        ? responseData.aggregations.max_gust.hits.hits[0]._source["@timestamp"]
        : undefined,
    },
    wind_histogram,
    timestamp: new Date(),
  };
  /* console.log(returnData); */

  return returnData as WindData;
};

interface ResponseData {
  aggregations: {
    time_buckets: {
      buckets: ResponseBucket[];
    };
    max_gust: {
      hits: { hits: ResponseBucketMaxGustHit[] };
    };
  };
}

interface ResponseBucket {
  key_as_string: string;
  avg_wind: {
    value: number;
  };
  max_gust: {
    hits: { hits: ResponseBucketMaxGustHit[] };
  };
}

interface ResponseBucketMaxGustHit {
  _source: {
    gust: number;
    direction: number;
    "@timestamp": Date;
  };
}
