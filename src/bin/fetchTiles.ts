import { promises as fs } from "fs";
import { fetchSegmentTile } from "../api/segmentTile";
import { authorizationParametersFromEnv } from "../api/common";

async function main() {
  // bounds gotten from https://chrishewett.com/blog/slippy-tile-explorer/?
  const topLeftBound = {
    x: 7482,
    y: 13476,
  };

  const bottomRightBound = {
    x: 7503,
    y: 13507,
  };

  const z = 15;

  const athleteId = "39822683";

  const totalSize =
    (topLeftBound.x - bottomRightBound.x - 1) *
    (topLeftBound.y - bottomRightBound.y - 1);
  let index = 0;

  for (let x = topLeftBound.x; x <= bottomRightBound.x; x++) {
    for (let y = topLeftBound.y; y <= bottomRightBound.y; y++) {
      console.log({ index, totalSize });

      const tile = await fetchSegmentTile(
        {
          athleteId,
          z,
          y,
          x,
        },
        authorizationParametersFromEnv()
      );

      if (tile) {
        const segments = Array(tile.layers.segments.length)
          .fill(0)
          // @ts-ignore
          .map((value, idx) => tile.layers.segments.feature(idx).toGeoJSON(x, y, z));

        await fs.writeFile(
          `./data/tiles/${z}-${x}-${y}.json`,
          JSON.stringify(segments)
        );
      }

      index++;
    }
  }
}

main();
