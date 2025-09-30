import Joi from "joi";

export const processPaymentSchema = Joi.object({
  customerId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  startDate: Joi.date().required(),
  paymentMethod: Joi.string().required(),
  idempotencyKey: Joi.string().required(),
  description: Joi.string().optional(),
});

export const createSubscriptionSchema = Joi.object({
  customerId: Joi.string().required(),
  planId: Joi.string().required(),
  startDate: Joi.date().optional(),
});

export const refundPaymentSchema = Joi.object({
  transactionId: Joi.string().required(),
  amount: Joi.number().positive().optional(),
});

export function validateProcessPayment(data: any) {
  return processPaymentSchema.validate(data);
}

export function validateCreateSubscription(data: any) {
  return createSubscriptionSchema.validate(data);
}

export function validateRefundPayment(data: any) {
  return refundPaymentSchema.validate(data);
}
