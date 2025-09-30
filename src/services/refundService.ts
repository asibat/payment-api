import { sequelize } from "../db";
import { Payment } from "../models/Payment";
import { Refund } from "../models/Refund";
import { RefundRequest, RefundResponse } from "../types";
import { processRefundWithGateway } from "./paymentGateway";

export async function processRefund(data: RefundRequest) {
  return await sequelize.transaction(async (t) => {
    try {
      const payment = await Payment.findOne({
        where: { id: data.transactionId },
        transaction: t,
      });
      if (!payment) {
        return { success: false, error: "Payment not found." };
      }
      if (payment.status === "completed") {
        return { success: false, error: "Payment already completed." };
      }

      let refund = await Refund.findOne({
        where: { paymentId: payment.id },
        transaction: t,
      });
      if (refund) {
        console.log("Existing refund found:", refund.id);

        if (refund?.status === "completed") {
          return { success: false, error: "Refund already completed." };
        }

        if (refund?.status === "failed") {
          // TODO: retry business logic
          return { success: false, error: "Previous refund failed." };
        }
      }

      const gatewayResponse = processRefundWithGateway({
        transactionId: payment.transactionId!,
        amount: data.amount,
      });

      refund = await Refund.create(
        {
          id: "refund_" + Math.floor(Math.random() * 1e9),
          paymentId: payment.id,
          amount: data.amount || payment.amount,
          status: gatewayResponse.success ? "completed" : "failed",
          refundId: gatewayResponse.refundId || "",
          reason: data.reason,
        },
        { transaction: t }
      );

      if (!gatewayResponse.success) {
        return {
          success: false,
          error: gatewayResponse.error || "Refund failed.",
        };
      }

      payment.status = "refunded";
      await payment.save({ transaction: t });

      return { success: true, refund };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });
}
