import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

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

app.listen(PORT, () => {
  console.log(`
    ================================
    🚀 Server is running!
    ================================
    Local:   http://localhost:${PORT}
    Health:  http://localhost:${PORT}/api/v1/health
    Mode:    ${process.env.NODE_ENV || "development"}
    ================================
    `);
});

export default app;
