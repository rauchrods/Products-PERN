import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimitingAndBotProtection from "./middleware/rateLimitingAndBotProtection.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(helmet()); //helmet is a security middleware that sets various HTTP headers to help protect your app from common web vulnerabilities
app.use(morgan("dev"));

// apply arcjet middleware
app.use(rateLimitingAndBotProtection);

app.use("/api/products", productRoutes);

initDB().then(() => {
  console.log("Database initialized");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
