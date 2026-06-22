import Redis from "ioredis";

const redisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  // password: process.env.REDIS_PASSWORD,
};

export const redis = new Redis(redisOptions);
export const redisConnection = redisOptions;

export default redis;
