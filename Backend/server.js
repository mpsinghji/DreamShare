import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();


process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down!");
  console.log(err.name, err.message);
  process.exit(1);
});

app.listen(process.env.PORT, () => {
  console.log(`Backend Server running on port ${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLE REJECTION ! Shutting down");
  console.log(err.name, err.message);
  ServiceWorkerRegistration.close(() => {
    process.exit(1);
  });
});
