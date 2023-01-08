import { fetchSegmentLeaderboard } from "../api/segmentLeaderboard";
import { authorizationParametersFromEnv } from "../api/common";
import { uniq } from "lodash";
import { fetchAndWrite, readTiles } from "../storage";
import { promises as fs } from "fs";

async function main() {
  const tiles = await readTiles();
  const segmentIdentifiers = uniq(tiles.map((tile) => tile.id));

  for (const [idx, segmentId] of segmentIdentifiers.entries()) {
    console.log({ idx, len: segmentIdentifiers.length });

    await fetchAndWrite(`./data/segments/${segmentId}.json`, () =>
      fetchSegmentLeaderboard(
        {
          segmentId: segmentId.toString(),
          athleteId: "39822683",
          ageGroup: "20_24",
        },
        authorizationParametersFromEnv()
      )
    );
  }
}

main();
