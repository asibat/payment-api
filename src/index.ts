import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import paymentRoutes from "./routes";
import { connectToDatabase, sequelize, syncDatabase } from "./db";
import { initPaymentModel } from "./models/Payment";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", paymentRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

async function startServer() {
  const PORT = process.env.PORT || 3000;
  try {
    await connectToDatabase(); // connect DB, show success/fail
    initPaymentModel(sequelize); // initialize model(s)
    await syncDatabase(); // sync models
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
