import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import ExpressMongoSanitize  from "express-mongo-sanitize";

import dotenv from "dotenv";
import path from "path";

import { fileURLToPath } from "url";
import globalErrorHandler from './controllers/errorController.js'

import userRoutes from "./routes/userRoutes.js";


dotenv.config({ path: "./config/config.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
); 

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));
app.use(ExpressMongoSanitize());


// Routes for users
app.use("/api/v1/users", userRoutes);

// Routes for posts


app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler);

export default app;
