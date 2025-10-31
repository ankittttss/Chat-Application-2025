import express from 'express';
const app = express();
import dotenv from 'dotenv';
import { startSendOtpConsumer } from './consumer.js';
dotenv.config();
const PORT = process.env.PORT || 3200;
startSendOtpConsumer();
app.use(express.json());
app.listen(PORT, () => {
    console.log('Mail service running on port 3270');
});
//# sourceMappingURL=index.js.map