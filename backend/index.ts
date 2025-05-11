import express, { urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDb } from "./configs/db";
import authRoutes from "./routes/authRoutes";

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

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server :>> ${PORT}`));
