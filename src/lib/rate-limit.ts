import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; // see below for cloudflare and fastly adapters

const KV_URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

if (!KV_URL || !KV_TOKEN) {
  throw new Error(
    "Please populate `KV_REST_API_URL` and `KV_REST_API_TOKEN` or `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`",
  );
}

const redis = new Redis({
  url: KV_URL,
  token: KV_TOKEN,
});

export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ratelimit:auth",
});

export const signUpRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "15 m"),
  analytics: true,
  prefix: "ratelimit:signup",
});
