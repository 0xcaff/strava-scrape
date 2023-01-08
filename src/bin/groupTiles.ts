import { promises as fs } from "fs";
import * as path from "path";

async function main() {
  const tilesPath = "./data/tiles";
  const files = await fs.readdir("./data/tiles");
  const tiles = await Promise.all(
    files.map(async (file) => {
      const fullPath = path.join(tilesPath, file);
      const contents = await fs.readFile(fullPath, { encoding: "utf-8" });

      return JSON.parse(contents);
    })
  );

  const flattened = tiles
    .flatMap((tile) => tile)
    .map((it) => ({
      type: it.type,
      geometry: it.geometry,
      id: it.id,
      ...it.properties,
    }))

  await fs.writeFile("./data/segments.geojson", JSON.stringify(flattened));
}

main();
