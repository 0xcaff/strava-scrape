import { promises as fs } from "fs";
import path from "path";
import { uniq } from "lodash";

export async function readTiles() {
  const tilesPath = "./data/tiles";
  const files = await fs.readdir(tilesPath);
  const tiles = await Promise.all(
    files.map(async (file) => {
      const contents = await fs.readFile(path.join(tilesPath, file), {
        encoding: "utf-8",
      });

      return JSON.parse(contents);
    })
  );

  return tiles
    .flatMap((tile) => tile)
    .map((it) => ({
      type: it.type,
      geometry: it.geometry,
      id: it.id,
      ...it.properties,
    }));
}

export async function readSegments() {
  const segmentsPath = "./data/segments";
  const files = await fs.readdir(segmentsPath);
  return await Promise.all(
    files.map(async (segment) => {
      const content = await fs.readFile(path.join(segmentsPath, segment), {
        encoding: "utf-8",
      });

      return JSON.parse(content);
    })
  );
}

export async function readAtheleteIds() {
  const segments = await readSegments();
  const entries = segments.flatMap((segment) => segment.entries);

  return uniq(entries.map((entry) => entry.athlete_id));
}
