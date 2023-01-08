import { promises as fs } from "fs";
import path from "path";
import { uniq } from "lodash";

async function readJsonDirectory(directory: string) {
  const files = await fs.readdir(directory);
  return await Promise.all(
    files.map(async (file) => {
      const contents = await fs.readFile(path.join(directory, file), {
        encoding: "utf-8",
      });

      return JSON.parse(contents);
    })
  );
}

export async function readTiles() {
  const tiles = await readJsonDirectory("./data/tiles");

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
  return await readJsonDirectory("./data/segments");
}

export async function readAtheleteIds() {
  const segments = await readSegments();
  const entries = segments.flatMap((segment) => segment.entries);

  return uniq(entries.map((entry) => entry.athlete_id));
}

export async function readAthleteFeeds() {
  return await readJsonDirectory("./data/feed/athlete");
}

export async function fetchAndWrite(path: string, fetchFn: () => any) {
  const fileExists = await fs
    .stat(path)
    .then(() => true)
    .catch(() => false);
  if (fileExists) {
    return;
  }

  await fs.writeFile(path, JSON.stringify(await fetchFn()));
}
