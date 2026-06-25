import mongoose from "mongoose";

mongoose.set("strictQuery", true);

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.log("❌ MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected");
});

export async function connectDB(): Promise<void> {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(mongoURI, {
      dbName: "ai-support-saas",
    });

    console.log("📦 Database: ai-support-saas");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}
