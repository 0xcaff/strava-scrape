import { RateLimiter } from "limiter";

export const limiter = new RateLimiter({
  tokensPerInterval: 100,
  interval: 15 * 60 * 1000,
});
