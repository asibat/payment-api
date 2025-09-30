import { Request, Response } from "express";
import { validateRefundPayment } from "../validators";
import { Refund } from "../models/Refund";
import { Payment } from "../models/Payment";

export async function processRefund(req: Request, res: Response) {
  // Implement refund processing logic here

  // check if payment exists
  // check there is no refund in progress for that payment/transaction
  // call payment gateway to process refund
  // save refund details in DB
  // return response

  const { error } = validateRefundPayment(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
}
