import { Request, Response } from "express";

import { processPayment } from "../services/paymentService";
import { validateProcessPayment } from "../validators";

export async function processPaymentHandler(req: Request, res: Response) {
  const { error } = validateProcessPayment(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const result = await processPayment(req.body);

    if (result.error) {
      return res.status(400).json({
        message: result.error,
        status: result.error,
      });
    }
    res.status(201).json(result.payment);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server error" });
  }
}
