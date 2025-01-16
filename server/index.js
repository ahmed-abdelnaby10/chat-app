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
import { Server } from "socket.io";
import http from "http"

dotenv.config();

// Connect to MongoDB
connectDB();

// Create express app
const app = express();

// Create express server
const expressServer = http.createServer(app);

// Create socket server combined with express server
const clientURL = process.env.CLIENT_URL

const io = new Server(
    expressServer,
    {cors: {
        origin: "*"
    }}
);

// Middlewares
const corsOptions = {
    origin: "*",
};

app.use(cors(corsOptions));
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

// Listen server on port 5000
const PORT = process.env.PORT || 5000;
expressServer.listen(PORT, () => {
    console.log('Server is running on port 5000');
});

// Real time connection and events
let onlineUsers = []

io.on("connection", (socket) => {
    console.log("New connection: ", socket.id);

    socket.on("addNewUser", (userId)=> {
        if (!onlineUsers.some((user) => user.userId === userId)) {
            onlineUsers.push({
                userId,
                socketId: socket.id
            })
        }
        io.emit("getOnlineUsers", onlineUsers)
        console.log(onlineUsers);
    })

    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find((user) => user.userId === message.recipientId)

        if (user) {
            io.to(user.socketId).emit("getMessage", message)
            io.to(user.socketId).emit("getNotification", {
                senderId: message.senderId,
                isRead: false,
                date: new Date()
            })
        }
    })
    
    socket.on("editMessage", (message) => {
        const recipientUser = onlineUsers.find((user) => user.userId === message.recipientId);
        const senderUser = onlineUsers.find((user) => user.userId === message.senderId);
        // Emit to the recipient if they're online
        if (recipientUser) {
            io.to(recipientUser.socketId).emit("getEditedMessage", message);
        }

        // Emit to the sender if they're online
        if (senderUser) {
            io.to(senderUser.socketId).emit("getEditedMessage", message);
        }
    })

    socket.on("reactToMessage", (message) => {
        const recipientUser = onlineUsers.find((user) => user.userId === message.recipientId);
        const senderUser = onlineUsers.find((user) => user.userId === message.senderId);
        // Emit to the recipient if they're online
        if (recipientUser) {
            io.to(recipientUser.socketId).emit("getReactedMessage", message);
        }

        // Emit to the sender if they're online
        if (senderUser) {
            io.to(senderUser.socketId).emit("getReactedMessage", message);
        }
    })
    
    socket.on("logout", () => {   
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
        io.emit("getOnlineUsers", onlineUsers)
    });

    socket.on("disconnect", ()=> {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)
        io.emit("getOnlineUsers", onlineUsers)
    })
});