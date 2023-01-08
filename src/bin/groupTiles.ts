import { promises as fs } from "fs";
import { readTiles } from "../storage";

async function main() {
  const tiles = await readTiles();
  await fs.writeFile("./data/segments.geojson", JSON.stringify(tiles));
}

main();
