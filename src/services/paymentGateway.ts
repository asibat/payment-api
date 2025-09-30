import {
  RefundRequest,
  RefundResponse,
  SubscriptionRequest,
  SubscriptionResponse,
  PaymentRequest,
  PaymentResponse,
} from "../types";

export function processPaymentMock(data: PaymentRequest): PaymentResponse {
  // random success/failure
  const isSuccess = Math.random() > 0.1;
  return {
    transactionId: "txn_" + Math.floor(Math.random() * 1e9),
    status: isSuccess ? "success" : "failure",
    processedAt: new Date(),
    message: isSuccess ? "Payment processed." : "Payment declined.",
  };
}

export function refundPaymentMock(data: RefundRequest): RefundResponse {
  const isSuccess = Math.random() > 0.1; // 90% success
  return {
    success: isSuccess,
    refundId: "refund_" + Math.floor(Math.random() * 1e9),
    message: isSuccess ? "Refund processed." : "Refund failed.",
  };
}

export function createSubscriptionMock(
  data: SubscriptionRequest
): SubscriptionResponse {
  const { customerId, planId } = data;
  if (!customerId || !planId) {
    return {
      success: false,
      error: "Invalid subscription data.",
      status: "failure",
    };
  }
  return {
    success: true,
    subscriptionId: "sub_" + Math.floor(Math.random() * 1e9),
    status: "active",
    message: "Subscription created.",
  };
}

export function processRefundWithGateway(data: {
  transactionId: string;
  amount?: number;
}): { success: boolean; refundId?: string; error?: string } {
  // Implement refund processing logic here
  return { success: false, error: "Not implemented." };
}

export function cancelSubscriptionMock(data: { subscriptionId: string }): {
  success: boolean;
  message?: string;
  error?: string;
} {
  return {
    success: true,
    message: "Subscription canceled.",
  };
}
