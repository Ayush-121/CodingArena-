import redis from "../config/redis.js";
const local = new Map();
export async function revoke(token, ttlSeconds) {
  if (redis?.status === "ready") return redis.set(`revoked:${token}`, "1", "EX", ttlSeconds);
  local.set(token, Date.now() + ttlSeconds * 1000);
}
export async function isRevoked(token) {
  if (redis?.status === "ready") return (await redis.exists(`revoked:${token}`)) === 1;
  const expiry = local.get(token);
  if (!expiry) return false;
  if (expiry < Date.now()) { local.delete(token); return false; }
  return true;
}
