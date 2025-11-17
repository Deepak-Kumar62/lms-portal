import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./configs/database.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

import authRoutes from "./routes/authRoutes/auth.routes.js";
import instructorCourseRoutes from "./routes/instructorRoutes/course.routes.js";
import instructorMediaRoutes from "./routes/instructorRoutes/media.routes.js";

const app = express();
const CLIENT_URL = process.env.CLIENT_URL;
const PORT = process.env.PORT;

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/instructor/course", instructorCourseRoutes);
app.use("/api/instructor/media", instructorMediaRoutes);

app.use(globalErrorHandler);

const startServer = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer();
