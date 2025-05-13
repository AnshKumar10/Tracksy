import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDb } from "./helpers/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();

app.use(urlencoded({ extended: false }));

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectToDb();

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/tasks", taskRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server :>> ${PORT}`));
