import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import documentRoutes from "./routes/document.routes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "AI Support SaaS API is running! 🚀",
    version: "1.0.0",
  });
});

app.get("/api/v1/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is healthy!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/documents", documentRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
    ================================
    🚀 NeuralDesk API
    ================================
    Local:   http://localhost:${PORT}
    Health:  http://localhost:${PORT}/api/v1/health
    Auth:    http://localhost:${PORT}/api/v1/auth
    Mode:    ${process.env.NODE_ENV || "development"}
    ================================
        `);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

export default app;
