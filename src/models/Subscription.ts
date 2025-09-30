import { DataTypes, Model, Sequelize } from "sequelize";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "unpaid"
  | "failure";

export class Subscription extends Model {
  public id!: string;
  public customerId!: string;
  public planId!: string;
  public startDate!: Date;
  public status!: SubscriptionStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initSubscriptionModel(sequelize: Sequelize) {
  Subscription.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      planId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "subscriptions",
      timestamps: true,
    }
  );
}
