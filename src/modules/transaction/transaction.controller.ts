import { Request, Response } from "express";

import { z } from "zod";
import { transactionQueue } from "../../queue/transactionQueue";

const transactionSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3),
});

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const payload = transactionSchema.parse(req.body);

    await transactionQueue.add("process-transaction", payload, {
      jobId: payload.id,
    });

    res.status(202).json({
      success: true,
      message: "Transaction accepted for processing",
      transactionId: payload.id,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
