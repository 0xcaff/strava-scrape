import {
  AuthorizationParameters,
  baseUrl,
  headersForAuthorization,
} from "./common";
import fetch from "node-fetch";

type SegmentLeaderboardParams = {
  segmentId: string;
  athleteId: string;

  gender?: "M" | "F";
  weightClass?: "125_149";
  ageGroup?: "20_24";
  clubId?: string;
  following?: boolean;
  dateRange?: "this_year" | 'this_month';
};

export async function fetchSegmentLeaderboard(
  { segmentId, athleteId, ...params }: SegmentLeaderboardParams,
  auth: AuthorizationParameters
) {
  const searchParams = new URLSearchParams([
    ["effort_athlete_id", athleteId],
    ['hl', 'en'],
    ...((): [string, string][] => {
      return Array.from(
        (function* () {
          if (params.gender) {
            yield ["gender", params.gender];
          }

          if (params.weightClass) {
            yield ["weight_class", params.weightClass];
          }

          if (params.clubId) {
            yield ["club_id", params.clubId];
          }

          if (params.ageGroup) {
            yield ["age_group", params.ageGroup];
          }

          if (params.following) {
            yield ["following", "true"];
          }

          if (params.dateRange) {
            yield ["date_range", params.dateRange];
          }
        })()
      );
    })(),
  ]);

  const url = new URL(
    `api/v3/segments/${segmentId}/leaderboard?${searchParams.toString()}`,
    baseUrl,
  );

  const response = await fetch(url, {
    headers: {
      ...headersForAuthorization(auth),
      ...defaultHeaders(),
    },
  });

  const body = await response.json();
  if (body.errors) {
      throw new Error(JSON.stringify(body));
  }

  return body;
}

function defaultHeaders() {
  return {
    "x-strava-nav-version": "2",
    "user-agent":
      "Strava/289.5 (oriole; Pixel 6; google; oriole; Android 13; 289.5, Code=1228226)",
    "time-offset-seconds": "-21600",
    "client-id": "2",
    "client-secret": "3bf7cfbe375675dd9329e9de56d046b4f02a186f",
    "accept-encoding": "gzip",
  };
}
