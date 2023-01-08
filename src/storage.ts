import { promises as fs } from "fs";
import path from "path";

export async function readTiles() {
  const tilesPath = "./data/tiles";
  const files = await fs.readdir("./data/tiles");
  const tiles = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(tilesPath, file);
      const contents = await fs.readFile(fullPath, { encoding: "utf-8" });

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
