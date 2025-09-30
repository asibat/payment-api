import e from "express";
import { DataTypes, Model, Sequelize } from "sequelize";

export class Refund extends Model {
  public id!: number;
  public paymentId!: number;
  public amount!: number;
  public status!: "pending" | "completed" | "failed";
  public refundId!: string;
  public reason?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export function initRefundModel(sequelize: Sequelize) {
  Refund.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      paymentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refundId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reason: { type: DataTypes.STRING, allowNull: true },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "refunds",
      timestamps: true,
    }
  );
}
