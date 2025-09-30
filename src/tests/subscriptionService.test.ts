import sinon from "sinon";
import { Subscription } from "../models/Subscription";
import * as Gateway from "../services/paymentGateway";
import { sequelize } from "../db";
import { createSubscription } from "../services/subscriptionService";

describe("Subscription Service", () => {
  let findOneStub: sinon.SinonStub;
  let createStub: sinon.SinonStub;
  let gatewayStub: sinon.SinonStub;
  let transactionStub: sinon.SinonStub;

  const fakeTransaction = {
    commit: sinon.stub().resolves(),
    rollback: sinon.stub().resolves(),
  };

  beforeEach(() => {
    findOneStub = sinon.stub(Subscription, "findOne");
    createStub = sinon.stub(Subscription, "create");
    gatewayStub = sinon.stub(Gateway, "createSubscriptionMock");
    transactionStub = sinon
      .stub(sequelize, "transaction")
      .resolves(fakeTransaction as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should create a new subscription", async () => {
    const subscriptionData = {
      customerId: "cust-1",
      planId: "plan-1",
      startDate: new Date(),
    };

    findOneStub.resolves(null);
    createStub.resolves({ ...subscriptionData, id: "sub-123" });
    gatewayStub.returns({
      status: "active",
      subscriptionId: "sub-123",
      success: true,
    });

    const result = await createSubscription(subscriptionData);

    expect(result.subscriptionId).toBe("sub-123");
    sinon.assert.calledOnce(findOneStub);
    sinon.assert.calledOnce(createStub);
  });

  it("should detect existing subscription", async () => {
    findOneStub.resolves({ id: "sub-123" });
    const subscriptionData = {
      customerId: "cust-1",
      planId: "plan-1",
      startDate: new Date(),
    };

    const result = await createSubscription(subscriptionData);

    expect(result.subscriptionId).toBe("sub-123");
    sinon.assert.calledOnce(findOneStub);
    sinon.assert.notCalled(createStub);
  });

  it("should handle invalid subscription data", async () => {
    const subscriptionData = {
      customerId: "",
      planId: "plan-1",
      startDate: new Date(),
    };

    const result = await createSubscription(subscriptionData);

    expect(result.error).toBe("Invalid subscription data.");
    sinon.assert.notCalled(findOneStub);
    sinon.assert.notCalled(createStub);
  });

  it("should handle gateway failure", async () => {
    gatewayStub.returns({
      status: "failure",
      message: "Error",
      success: false,
    });
    findOneStub.resolves(null);
    createStub.resolves({
      id: "sub-123",
      customerId: "cust-1",
      planId: "plan-1",
      startDate: new Date(),
    });

    const subscriptionData = {
      customerId: "cust-1",
      planId: "plan-1",
      startDate: new Date(),
    };

    const result = await createSubscription(subscriptionData);

    expect(result.subscriptionId).toBeUndefined();
    expect(result.error).toBe("Error");
    sinon.assert.calledOnce(findOneStub);
    sinon.assert.calledOnce(gatewayStub);
    sinon.assert.notCalled(createStub);
  });
});
