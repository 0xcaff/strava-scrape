import { Response } from "node-fetch";

export const baseUrl = "https://cdn-1.strava.com";

export type AuthorizationParameters = {
  token: string;
};

export function authorizationParametersFromEnv(): AuthorizationParameters {
  return {
    token: process.env.STRAVA_TOKEN!,
  };
}

export function headersForAuthorization(auth: AuthorizationParameters) {
  return {
    authorization: `Bearer ${auth.token}`,
  };
}

export function defaultHeaders() {
  return {
    "x-strava-nav-version": "2",
    "user-agent":
      "Strava/289.5 (oriole; Pixel 6; google; oriole; Android 13; 289.5, Code=1228226)",
    "time-offset-seconds": "-21600",
    "accept-encoding": "gzip",
  };
}

export function clientHeaders() {
  return {
    "client-id": "2",
    "client-secret": "3bf7cfbe375675dd9329e9de56d046b4f02a186f",
  };
}

export async function handleResponse(response: Response) {
  const body = await response.json();
  if (body.errors) {
    throw new Error(JSON.stringify(body));
  }

  return body;
}
