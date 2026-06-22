import { Worker, Job } from "bullmq";
import { redisConnection } from "../config/redis";
import { prisma } from "../db/prisma";

const QUEUE_NAME = "transactions";

const worker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    try {
      const { id, userId, amount, currency } = job.data;

      console.log(` Processing transaction ${id} for user ${userId}`);
      const existing = await prisma.transaction.findUnique({ where: { id } });
      if (existing) {
        console.log(`Transaction ${id} already processed`);

        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      await prisma.transaction.create({
        data: {
          id,
          userId,
          amount,
          currency,
          timestamp: new Date(),
        },
      });

      console.log(
        ` Successfully processed transaction ${id} for user ${userId}`,
      );
    } catch (error: any) {
      console.error(` Error processing job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 10,
    removeOnComplete: { count: 200 },
    removeOnFail: { count: 100 },
  },
);

const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down worker...`);

  try {
    await worker.close(true);
    console.log(" Worker closed gracefully.");

    await prisma.$disconnect();
    console.log(" Prisma disconnected.");

    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

worker.on("error", (err) => {
  console.error("Worker encountered an error:", err);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

export default worker;
