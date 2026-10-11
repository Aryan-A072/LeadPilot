import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import qualificationRoutes from "./routes/qualification.route.js";
import leadRoutes from "./routes/lead.routes.js";

import { notFound, errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

import dns from "dns"
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: "Internal server error",
  });
});

app.use(express.json({ limit: "100kb" }));

app.use("/api/qualification", qualificationRoutes);
app.use("/api/leads", leadRoutes);

// Handle requests to nonexistent routes
app.use(notFound);
// Handle errors passed to Express
app.use(errorHandler);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "LeadPilot API",
  });
});

app.use("/api/qualification", qualificationRoutes);

// Start listening only after MongoDB connects.
const PORT = process.env.PORT || 5000;

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`LeadPilot API running on port ${PORT}`);
  });
} catch (error) {
  console.error("Failed to start application:", error.message);
  process.exit(1);
}