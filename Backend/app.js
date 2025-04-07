import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Mount routes
app.use("/api/v1/users", userRoutes);

export default app;
