import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const transactionQueue = new Queue("transactions", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
