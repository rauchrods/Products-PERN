import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimitingAndBotProtection from "./middleware/rateLimitingAndBotProtection.js";
import cluster from "cluster";
import os from "os";

dotenv.config();

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} is running`);
  console.log(`Launching ${numCPUs} workers`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for dying workers and replace them
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`
    );
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

  const app = express();
  const PORT = process.env.PORT;

  app.use(express.json());
  app.use(express.urlencoded({ extended: false })); // a middleware used to upload files to the server
  app.use(cors());
  app.use(helmet()); //helmet is a security middleware that sets various HTTP headers to help protect your app from common web vulnerabilities
  app.use(morgan("dev"));

  // apply arcjet middleware (rate limiting and bot protection)
  app.use(rateLimitingAndBotProtection);

  app.use("/api/products", productRoutes);

  initDB().then(() => {
    console.log("Database initialized");
    app.listen(PORT, () =>
      console.log(
        `Server running on port ${PORT} and env is ${process.env.NODE_ENV}`
      )
    );
  });
}
