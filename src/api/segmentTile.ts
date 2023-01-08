import { VectorTile } from "@mapbox/vector-tile";
import fetch from "node-fetch";
import Protobuf from "pbf";
import {
  AuthorizationParameters,
  baseUrl,
  headersForAuthorization,
} from "./common";

export type SegmentTileParameters = {
  z: number;
  x: number;
  y: number;
  athleteId: string;
};

export async function fetchSegmentTile(
  { athleteId, z, x, y }: SegmentTileParameters,
  auth: AuthorizationParameters
): Promise<VectorTile | null> {
  const searchParams = new URLSearchParams([
    ["intent", "default"],
    ["activity_types", "RUN"],
    ["distance_min", "0"],
    ["elevation_filter", "all"],
    ["surface_types", "0"],
  ]);

  const url = new URL(
    `/tiles/segments/${athleteId}/${z}/${x}/${y}?${searchParams.toString()}`,
    baseUrl
  );

  const response = await fetch(url.toString(), {
    headers: {
      ...headersForAuthorization(auth),
      "accept-encoding": "gzip",
      "user-agent": "okhttp/4.9.3",
    },
  });

  if (response.status === 404) {
    return null;
  }

  const body = await response.arrayBuffer();

  const protobuf = new Protobuf(body);
  return new VectorTile(protobuf);
}
