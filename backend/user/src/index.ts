import express from "express";
import dotenv from "dotenv";
import ConnecttoDB from "./config/db.js";
import { createClient } from "redis";
import { connectToRabbitMQ } from "./config/Rabbitmq.js";
import userRoutes from "./routes/user.js";

dotenv.config(); // ✅ should be called early

export const redisClient = createClient({
  url: 'rediss://default:AWCBAAIncDIyYzdiYjMyZjhiODc0NzJlYmM4MjIxZmY4MGYyZTJiM3AyMjQ3MDU@primary-fly-24705.upstash.io:6379',
});

redisClient.connect()
  .then(() => console.log("✅ Connected to Redis"))
  .catch(err => console.error("❌ Error connecting to Redis:", err));

connectToRabbitMQ();
ConnecttoDB();

const app = express();

// ✅ Important middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Listening on port 3000");
});
