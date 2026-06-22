import redis from "../../config/redis";
import { prisma } from "../../db/prisma";

interface UserVolume {
  userId: string;
  volume: number;
}

interface AnalyticsSummary {
  totalVolume: number;
  totalTransactions: number;
  topUsers: UserVolume[];
  lastUpdated: string;
}

const CACHE_KEY = "analytics:summary";
const CACHE_TTL = 2; // seconds

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  const lockKey = `${CACHE_KEY}:lock`;

  const lock = await redis.set(lockKey, "1", "EX", 5, "NX");

  if (lock !== "OK") {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getAnalyticsSummary();
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 1, 2000));

    const transactions = await prisma.transaction.findMany({
      select: {
        userId: true,
        amount: true,
      },
    });

    const totalVolume = transactions.reduce(
      (sum: number, t: { amount: any }) => sum + Number(t.amount),
      0,
    );

    const userVolumesMap = transactions.reduce(
      (acc: Record<string, number>, t: { userId: string; amount: any }) => {
        const amount = Number(t.amount);
        acc[t.userId] = (acc[t.userId] || 0) + amount;
        return acc;
      },
      {},
    );

    const topUsers: UserVolume[] = Object.entries(userVolumesMap)
      .sort(([, a], [, b]) => Number(b) - Number(a))
      .slice(0, 5)
      .map(([userId, volume]) => ({
        userId,
        volume: Number(volume),
      }));

    const result: AnalyticsSummary = {
      totalVolume,
      totalTransactions: transactions.length,
      topUsers,
      lastUpdated: new Date().toISOString(),
    };

    await redis.set(CACHE_KEY, JSON.stringify(result), "EX", CACHE_TTL);

    return result;
  } finally {
    await redis.del(lockKey);
  }
};
