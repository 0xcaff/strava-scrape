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
