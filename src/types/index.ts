import { SubscriptionStatus } from "../models/Subscription";

export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: string;
  description?: string;
  idempotencyKey?: string;
  customerId: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: "success" | "failure";
  processedAt: Date;
  message?: string;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number;
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  error?: string;
  message?: string;
  status?: "success" | "failure";
}

export interface SubscriptionRequest {
  customerId: string;
  planId: string;
  startDate?: Date;
}

export interface SubscriptionResponse {
  success: boolean;
  subscriptionId?: string;
  error?: string;
  status: SubscriptionStatus;
  message?: string;
}
