import { Subscription } from "../models/Subscription";
import {
  cancelSubscriptionMock,
  createSubscriptionMock,
} from "./paymentGateway";

export async function createSubscription(data: {
  customerId: string;
  planId: string;
  startDate: Date;
}): Promise<{ subscriptionId?: string; error?: string }> {
  if (!data.customerId || !data.planId) {
    return { error: "Invalid subscription data." };
  }

  const existingSubscription = await Subscription.findOne({
    where: {
      customerId: data.customerId,
      planId: data.planId,
      status: "active",
    },
  });
  if (existingSubscription) {
    console.log("Subscription already exists:", existingSubscription.id);
    return {
      subscriptionId: existingSubscription.id,
    };
  }

  const res = createSubscriptionMock(data);
  if (!res.success || res.status !== "active") {
    return { error: res.message || "Failed to create subscription." };
  }

  const subscription = await Subscription.create({
    id: res.subscriptionId,
    customerId: data.customerId,
    planId: data.planId,
    startDate: data.startDate,
    status: "active",
  });

  return { subscriptionId: subscription.id };
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await Subscription.findByPk(subscriptionId);
  if (!subscription) {
    return { error: "Subscription not found." };
  }
  if (subscription.status === "canceled") {
    return { message: "Subscription already canceled." };
  }
  const res = cancelSubscriptionMock({ subscriptionId });
  if (!res.success) {
    return { error: res.error || "Failed to cancel subscription." };
  }
  subscription.status = "canceled";
  await subscription.save();

  return { message: "Subscription canceled successfully." };
}
