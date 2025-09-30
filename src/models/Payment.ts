import { DataTypes, Model, Sequelize } from "sequelize";

export class Payment extends Model {
  public id!: string;
  public customerId!: string;
  public amount!: number;
  public currency!: string;
  public paymentMethod!: string;
  public status!: string;
  public createdAt!: Date;
  public transactionId?: string;
  public idempotencyKey?: string;
  // payment type?
  public description?: string;
  public readonly updatedAt!: Date;
}

export function initPaymentModel(sequelize: Sequelize) {
  Payment.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      idempotencyKey: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: { type: DataTypes.STRING, allowNull: true },
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
      tableName: "payments",
      timestamps: true,
    }
  );
}
