import amqp from "amqplib";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const startSendOtpConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.RABBITMQ_HOST,
      port: 5672,
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASSWORD,
    });

    const channel = await connection.createChannel();
    const queue_name = "send-otp";
    await channel.assertQueue(queue_name, { durable: true });
    console.log("✅ Connected to RabbitMQ, waiting for messages in", queue_name);

    channel.consume(queue_name, async (msg) => {
      if (msg) {
        try {
          const { to, subject, body } = JSON.parse(msg.content.toString());
          console.log("📩 Received message:", { to, subject });

          // setTimeout(() => {}, 10000); // Simulate delay

          const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD,
            },
          });

          await transporter.sendMail({
            from: "ankitsaini955831@gmail.com",
            to:"anmolsainiii23@gmail.com",
            subject:"Your OTP Email is",
            html: body,
          });

          console.log(`✅ Email sent successfully to ${to}`);
          channel.ack(msg);
        } catch (err) {
          console.error("❌ Error processing message:", err);
          channel.nack(msg);
        }
      }
    });
  } catch (error) {
    console.error("❌ Failed to connect to RabbitMQ Consumer:");
  }
};
