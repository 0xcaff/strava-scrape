import { readAthleteFeeds, readAthleteStats } from "../storage";
import { differenceInDays } from "date-fns";
import * as turf from "@turf/turf";

async function main() {
  const feeds = await readAthleteFeeds();
  const athleteStats = new Map(
    (await readAthleteStats()).map(([stats, id]) => [id, stats])
  );

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

      const athleteId = item.athlete.id.toString();
      const stats = athleteStats.get(athleteId);

      return [
        {
          athleteId,
          feed,
          latestActivityDate: new Date(item.start_date),
          stats,
        },
      ];
    })
    .filter((it) => differenceInDays(new Date(), it.latestActivityDate) <= 30)
    .filter((it) => {
      return it.stats.recent_run_totals.count >= 3;
    })
    .filter((it) => it.stats.recent_run_totals.distance <= 60_000)
    .filter((it) => {
      const homeBounds = turf.circle([-97.730264, 30.329635], 5, {
        units: "miles",
      });

      const nearbyActivity = it.feed.find((feedItem: any) => {
          if (differenceInDays(new Date(), new Date(feedItem.item.start_date)) > 30) {
              return false;
          }

          if (!feedItem.item.bounding_box) {
              return false;
          }

        const [[minX, minY], [maxX, maxY]] = feedItem.item.bounding_box;
        const activityBoundingBox = turf.bboxPolygon([minY, minX, maxY, maxX]);

        return turf.booleanContains(homeBounds, activityBoundingBox) || turf.intersect(activityBoundingBox, homeBounds);
      });

      return !!nearbyActivity;
    })
    .filter((it) => {
      const bestMileEffort = it.stats.best_efforts.find(
        (it: any) => it.name === "1 mile"
      );
      if (!bestMileEffort) {
        return false;
      }

      return (
        bestMileEffort.elapsed_time <= 9 * 60 &&
        bestMileEffort.elapsed_time >= 6 * 60
      );
    })
    .sort(
      (a, b) => b.latestActivityDate.valueOf() - a.latestActivityDate.valueOf()
    );

  console.log({ found: filtered.length });
  for (const item of filtered) {
    console.log(`https://www.strava.com/athletes/${item.athleteId}`);
  }
}

main();
