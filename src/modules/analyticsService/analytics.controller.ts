import { Request, Response } from "express";
import { getAnalyticsSummary } from "./analytics.service";

export const getSummary = async (_req: Request, res: Response) => {
  try {
    const data = await getAnalyticsSummary();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
