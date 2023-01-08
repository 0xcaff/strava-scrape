import { readAtheleteIds } from "../storage";
import { fetchAthleteFeed } from "../api/atheletes";
import { authorizationParametersFromEnv } from "../api/common";
import { promises as fs } from "fs";

export async function main() {
  const athleteIds = await readAtheleteIds();
  const auth = authorizationParametersFromEnv();

  for (const [idx, athleteId] of athleteIds.entries()) {
    console.log({ idx, len: athleteIds.length });

    const feed = await fetchAthleteFeed(athleteId.toString(), auth);

    await fs.writeFile(
      `./data/feed/athlete/${athleteId}.json`,
      JSON.stringify(feed)
    );
  }
}

main();
