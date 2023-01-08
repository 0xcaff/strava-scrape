import { fetchSegmentLeaderboard } from "../api/segmentLeaderboard";
import { authorizationParametersFromEnv } from "../api/common";
import { uniq } from "lodash";
import { readTiles } from "../storage";
import { promises as fs } from "fs";

async function main() {
  const tiles = await readTiles();
  const segmentIdentifiers = uniq(tiles.map((tile) => tile.id));

  for (const [idx, segmentId] of segmentIdentifiers.entries()) {
    console.log({ idx, len: segmentIdentifiers.length });

    const response = await fetchSegmentLeaderboard(
      {
        segmentId: segmentId.toString(),
        athleteId: "39822683",
          ageGroup: '20_24',
      },
      authorizationParametersFromEnv()
    );

    await fs.writeFile(
      `./data/segments/${segmentId}.json`,
      JSON.stringify(response)
    );
  }
}

main();
