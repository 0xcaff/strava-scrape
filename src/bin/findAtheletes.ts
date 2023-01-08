import { readAthleteFeeds } from "../storage";
import { differenceInDays } from "date-fns";

async function main() {
  const feeds = await readAthleteFeeds();
  const filtered = feeds
    .flatMap((feed) => {
      if (!feed.length) {
        return [];
      }

      const [firstItem] = feed;
      const item = firstItem.item;

      if (!item) {
        return [];
      }

      if (!item.athlete) {
        return [];
      }

      return [
        {
          athleteId: item.athlete.id,
          startDate: new Date(item.start_date),
        },
      ];
    })
    .filter((it) => differenceInDays(new Date(), it.startDate) <= 30)
    .sort((a, b) => b.startDate.valueOf() - a.startDate.valueOf());

  console.log({ filtered });
  for (const item of filtered) {
    console.log(`https://www.strava.com/athletes/${item.athleteId}`);
  }
}

main();
