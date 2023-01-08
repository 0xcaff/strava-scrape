import {
  AuthorizationParameters,
  baseUrl,
  defaultHeaders,
  handleResponse,
  headersForAuthorization,
} from "./common";
import fetch from "node-fetch";

export async function fetchAthleteStats(
  athleteId: string,
  auth: AuthorizationParameters
) {
  const searchParams = new URLSearchParams([["hl", "en"]]);

  const url = new URL(
    `api/v3/athletes/${athleteId}/stats?${searchParams.toString()}`,
    baseUrl
  );

  const response = await fetch(url, {
    headers: {
      ...headersForAuthorization(auth),
      ...defaultHeaders(),
    },
  });

  return handleResponse(response);
}

export async function fetchAthleteFeed(
    athleteId: string,
    auth: AuthorizationParameters
) {
  const searchParams = new URLSearchParams([["hl", "en"]]);

  const url = new URL(
      `api/v3/feed/athlete/${athleteId}?${searchParams.toString()}`,
      baseUrl
  );

  const response = await fetch(url, {
    headers: {
      ...headersForAuthorization(auth),
      ...defaultHeaders(),
    },
  });

  return handleResponse(response);

}