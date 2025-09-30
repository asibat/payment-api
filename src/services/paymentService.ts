import { sequelize } from "../db";
import { Payment } from "../models/Payment";
import { processPaymentMock, refundPaymentMock } from "./paymentGateway";

export async function processPayment(data: {
  customerId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  idempotencyKey: string;
}): Promise<{
  payment?: Payment;
  error?: string;
}> {
  const transaction = await sequelize.transaction();

  try {
    const existingPayment = await Payment.findOne({
      where: { idempotencyKey: data.idempotencyKey },
    });
    if (existingPayment) {
      console.log("Idempotent payment found:", existingPayment.id);
      await transaction.commit();
      return { payment: existingPayment };
    }

    const gatewayResults = processPaymentMock(data);
    if (gatewayResults.status === "failure") {
      return {
        error: gatewayResults.message,
      };
    }

    const payment = await Payment.create(
      {
        id: "pay_" + Math.floor(Math.random() * 1e9),
        customerId: data.customerId,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        status: "completed",
        idempotencyKey: data.idempotencyKey,
        transactionId: gatewayResults.transactionId,
      },
      { transaction }
    );

    await transaction.commit();
    return { payment };
  } catch (error) {
    await transaction.rollback();
    return { error: "Payment processing failed." };
  }
}

export async function refundPayment(data: {
  transactionId: string;
  amount?: number;
}): Promise<{ success: boolean; refundId?: string; error?: string }> {
  const transactionId = data.transactionId;
  try {
    const transactionExists = await Payment.findOne({
      where: { transactionId },
    });
    if (!transactionExists) {
      return { success: false, error: "Transaction not found." };
    }
    const results = refundPaymentMock(data);
    if (results.status === "success") {
      const isEntryUpdated = await Payment.update(
        { status: "refunded" },
        { where: { transactionId } }
      );
      if (isEntryUpdated[0] === 0) {
        return { success: false, error: "Failed to update payment status." };
      }
      return { success: true, refundId: results.refundId };
    } else {
      return { success: false, error: results.message };
    }
  } catch (error) {
    console.error("Error processing refund:", error);
    return { success: false, error: "Refund processing failed." };
  }
}

export async function createSubscription(data: {
  customerId: string;
  planId: string;
  startDate?: string;
}): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
  // Implement subscription logic here, possibly interacting with payment gateway
  return {
    success: false,
    error: "Subscription functionality not implemented.",
  };
}
