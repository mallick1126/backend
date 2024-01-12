import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { limit } from "./constant.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: `${limit}` }));
app.use(urlencoded({ extended: true, limit: `${limit}` }));
app.use(express.static("public"));
app.use(cookieParser());


// Imports routers
import userRouter from "./routes/user.routes.js"

// Routes declaration
app.use("/api/v1/users", userRouter)

export { app };
