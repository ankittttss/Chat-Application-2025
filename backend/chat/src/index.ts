import express from 'express';
import dotenv from 'dotenv';
import ConnecttoDB from './config/db.js';
import chatRoutes from './routes/chat.js';

dotenv.config();
ConnecttoDB();

const app = express();
const PORT = 3003;

app.use(express.json());
app.use("/api/v1",chatRoutes);


app.listen(3003,()=>{
    console.log(`Server is running on port ${PORT}`);
})
