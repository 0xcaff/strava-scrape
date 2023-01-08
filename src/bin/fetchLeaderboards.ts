import { fetchSegmentLeaderboard } from "../api/segmentLeaderboard";
import { authorizationParametersFromEnv } from "../api/common";

async function main() {
    // todo: probably fetch all the cuts
  const response = await fetchSegmentLeaderboard(
    {
      segmentId: "26456715",
      athleteId: "39822683",
        // ageGroup: '20_24',
        // gender: 'M',
        // weightClass: '125_149',
        // dateRange: 'this_year'
    },
    authorizationParametersFromEnv()
  );

  console.log(response);
}

main();
