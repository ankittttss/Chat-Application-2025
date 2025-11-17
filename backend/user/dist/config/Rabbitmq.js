import amqpl from "amqplib";
import dotenv from "dotenv";
dotenv.config();
let channel;
export const connectToRabbitMQ = async () => {
    try {
        const connection = await amqpl.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST,
            port: 5672,
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD,
        });
        channel = await connection.createChannel();
    }
    catch (err) {
        console.error("Error connecting to RabbitMQ:", err);
    }
};
export const publishToQueue = async (queueName, message) => {
    if (!channel) {
        throw new Error("RabbitMQ channel is not established");
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true
    });
};
//# sourceMappingURL=Rabbitmq.js.map