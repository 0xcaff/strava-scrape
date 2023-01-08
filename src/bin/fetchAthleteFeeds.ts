import { fetchAndWrite, readAtheleteIds } from "../storage";
import { fetchAthleteFeed } from "../api/atheletes";
import { authorizationParametersFromEnv } from "../api/common";

export async function main() {
  const athleteIds = await readAtheleteIds();
  const auth = authorizationParametersFromEnv();

  for (const [idx, athleteId] of athleteIds.entries()) {
    console.log({ idx, len: athleteIds.length });

    await fetchAndWrite(`./data/feed/athlete/${athleteId}.json`, () =>
      fetchAthleteFeed(athleteId.toString(), auth)
    );
  }
}

main();
