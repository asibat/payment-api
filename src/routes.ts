import express from "express";
import { processPaymentHandler } from "./controllers/paymentController";
import { createSubscriptionHandler } from "./controllers/subscriptionController";
import { processRefund } from "./services/refundService";

const router = express.Router();

router.post("/process-payment", processPaymentHandler);
router.post("/create-subscription", createSubscriptionHandler);
router.post("/refund-payment", processRefund);

router.get("/subscriptions", () => {});
router.put("/subscriptions/:id", () => {});
router.delete("/subscriptions/:id", () => {});

export default router;
