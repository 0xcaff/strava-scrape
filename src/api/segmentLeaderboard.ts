import {
  AuthorizationParameters,
  baseUrl,
  clientHeaders,
  defaultHeaders,
  handleResponse,
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
  dateRange?: "this_year" | "this_month";
};

export async function fetchSegmentLeaderboard(
  { segmentId, athleteId, ...params }: SegmentLeaderboardParams,
  auth: AuthorizationParameters
) {
  const searchParams = new URLSearchParams([
    ["effort_athlete_id", athleteId],
    ["hl", "en"],
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
    baseUrl
  );

  const response = await fetch(url, {
    headers: {
      ...headersForAuthorization(auth),
      ...clientHeaders(),
      ...defaultHeaders(),
    },
  });

  return handleResponse(response);
}
