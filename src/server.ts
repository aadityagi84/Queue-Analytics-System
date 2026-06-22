import express from "express";
import compression from "compression";
import morgan from "morgan";
import { apiLimiter } from "./middleware/rateLimiter";
import { notFound } from "./utils/notFound";
import { errorHandler } from "./utils/errorHandler";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import "./queue/worker";
import TransitionRouter from "./modules/transaction/transaction.route";
import sumaryRoutes from "./modules/analyticsService/analytics.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(compression());
app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(apiLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// routes
app.use("/v1/transactions", TransitionRouter);
app.use("/v1/analytics/summary", sumaryRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    `Server will be up on http://localhost:${PORT}  till ${new Date().toISOString()}`,
  );
});

export default app;
