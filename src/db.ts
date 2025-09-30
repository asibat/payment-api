import { Sequelize } from "sequelize";
import { initPaymentModel } from "./models/Payment";

export const sequelize = new Sequelize(
  process.env.DATABASE_URL || "sqlite::memory:"
);

export const connectToDatabase = async () => {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
};

export async function syncDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
    throw error;
  }
}
