import sinon from "sinon";
import * as PaymentModel from "../models/Payment";
import * as Gateway from "../services/paymentGateway";
import { processPayment } from "../services/paymentService";
import { sequelize } from "../db";

describe("processPayment", () => {
  let findOneStub: sinon.SinonStub;
  let createStub: sinon.SinonStub;
  let gatewayStub: sinon.SinonStub;
  let transactionStub: sinon.SinonStub;

  const fakeTransaction = {
    commit: sinon.stub().resolves(),
    rollback: sinon.stub().resolves(),
  };

  beforeEach(() => {
    findOneStub = sinon.stub(PaymentModel.Payment, "findOne");
    createStub = sinon.stub(PaymentModel.Payment, "create");
    gatewayStub = sinon.stub(Gateway, "processPaymentMock");
    transactionStub = sinon
      .stub(sequelize, "transaction")
      .resolves(fakeTransaction as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should process a new payment", async () => {
    const paymentData = {
      customerId: "cust-1",
      amount: 100,
      currency: "USD",
      paymentMethod: "card",
      idempotencyKey: "unique-key-1",
    };

    findOneStub.resolves(null);
    gatewayStub.returns({ status: "success", transactionId: "txn-456" });
    createStub.resolves({ ...paymentData, transactionId: "txn-456" });

    const result = await processPayment(paymentData);

    expect(result.payment?.transactionId).toBe("txn-456");
    sinon.assert.calledOnce(findOneStub);
    sinon.assert.calledOnce(gatewayStub);
    sinon.assert.calledOnce(createStub);
  });

  it("should detect duplicate payment", async () => {
    findOneStub.resolves({ id: 1 });
    const paymentData = {
      customerId: "cust-1",
      amount: 100,
      currency: "USD",
      paymentMethod: "card",
      idempotencyKey: "unique-key-1",
    };

    const result = await processPayment(paymentData);

    expect(result.payment?.id).toBe(1);
    sinon.assert.calledOnce(findOneStub);
    sinon.assert.notCalled(gatewayStub);
    sinon.assert.notCalled(createStub);
  });

  it("should handle gateway failure", async () => {
    findOneStub.resolves(null);
    gatewayStub.returns({ status: "failure", message: "Declined" });

    const result = await processPayment({
      customerId: "cust-1",
      amount: 100,
      currency: "USD",
      paymentMethod: "card",
      idempotencyKey: "unique-key-2",
    });

    expect(result.error).toBe("Declined");
    sinon.assert.calledOnce(findOneStub);
    sinon.assert.calledOnce(gatewayStub);
    sinon.assert.notCalled(createStub);
  });
});
