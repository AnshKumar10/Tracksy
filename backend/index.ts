import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDb } from "./configs/db";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectToDb();

app.use(express.json());

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server :>> ${PORT}`));
