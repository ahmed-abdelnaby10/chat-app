import express from 'express';
import cors from 'cors'
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './routes/user.route.js'
import chatRouter from './routes/chat.route.js'
import messageRouter from './routes/message.route.js'
import { formatResponse } from './utils/formatResponse.js';
import { httpStatus } from './utils/httpStatusText.js';

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', userRouter)
app.use('/api/chats', chatRouter)
app.use('/api/messages', messageRouter)

// 404 Error Handler
app.all('*', (req, res) => {
    res.status(404).json(formatResponse(httpStatus.ERROR, null, "This resource isn't avilable.", 404));
});

// Global Error Handler
app.use((error, req, res) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || httpStatus.FAIL,
        message: error.message,
        code: error.statusCode,
        data: null
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res)=> {
    console.log("Server is runnung on port 5000!");
})