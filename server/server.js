import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./router/authRouter.js";
import userRouter from "./router/userRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

const allowedOrigins = ["http://localhost:5173"];

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({ origin: "https://demo-auth-sx6a.onrender.com", credentials: true })
);

app.get("/", (req, res) => {
  res.send("Server running just file!");
});

// Root Endpoints
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

//Start Listening Server
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} -------------->`)
);
