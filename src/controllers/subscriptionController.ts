import { Request, Response } from "express";

import { createSubscription } from "../services/subscriptionService";
import {
  createSubscriptionSchema,
  validateCreateSubscription,
} from "../validators";

export async function createSubscriptionHandler(req: Request, res: Response) {
  const { error } = validateCreateSubscription(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const result = await createSubscription(req.body);

    if (result.error) {
      return res.status(400).json({
        error: result.error,
      });
    }
    res.status(201).json({ subscriptionId: result.subscriptionId });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server error" });
  }
}

export async function cancelSubscriptionHandler(req: Request, res: Response) {
  const { subscriptionId } = req.params;
  if (!subscriptionId) {
    return res.status(400).json({ error: "Subscription ID is required." });
  }

  try {
    // Implement cancellation logic here
    // For now, just return a success message
    res.json({ message: `Subscription ${subscriptionId} cancelled.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server error" });
  }
}
