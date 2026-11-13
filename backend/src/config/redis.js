import Redis from "ioredis";
let redis = null;
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
  redis.on("error", e => console.warn("Redis unavailable:", e.message));
  redis.connect().catch(() => console.warn("Redis connection skipped; using in-memory token denylist"));
}
export default redis;
