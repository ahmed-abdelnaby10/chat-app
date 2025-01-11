import { Server } from "socket.io";

const io = new Server({ cors: "http://localhost:5173/" });

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

io.listen(8080);