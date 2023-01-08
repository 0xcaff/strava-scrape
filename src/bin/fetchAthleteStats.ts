import { fetchAndWrite, readAtheleteIds } from "../storage";
import { fetchAthleteStats } from "../api/atheletes";
import { authorizationParametersFromEnv } from "../api/common";

async function main() {
  const athletes = await readAtheleteIds();
  const auth = authorizationParametersFromEnv();

  for (const [idx, athleteId] of athletes.entries()) {
    console.log({ idx, len: athletes.length });
    await fetchAndWrite(`./data/athlete/stats/${athleteId}.json`, () =>
      fetchAthleteStats(athleteId.toString(), auth)
    );
  }
}

main();
