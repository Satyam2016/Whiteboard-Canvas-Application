const express = require('express');
const cors = require('cors');
const http = require('http');
const { db } = require('./firebaseConfig');
const { Server } = require("socket.io");
const roomRoutes = require("./routes/roomRoutes");

const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/user');

// Main App Server
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.send('Main Server is ready');
});


io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", ({ username, roomId }) => {
        socket.join(roomId);
        console.log(`${username} joined room ${roomId}`);

        if (!rooms[roomId]) {
            rooms[roomId] = [];
        }
        rooms[roomId].push({ id: socket.id, username });

        io.to(roomId).emit("roomUsers", rooms[roomId]); // Notify all users
    });

    socket.on("leaveRoom", ({ username, roomId }) => {
        socket.leave(roomId);
        console.log(`${username} left room ${roomId}`);

        if (rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter(user => user.id !== socket.id);
            io.to(roomId).emit("roomUsers", rooms[roomId]);
        }
    });

    socket.on("draw", ({ roomId, strokeData }) => {
        socket.broadcast.to(roomId).emit("drawResponse", strokeData);
    });

    socket.on("clearBoard", (roomId) => {
        io.to(roomId).emit("clearBoardResponse");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        for (let roomId in rooms) {
            rooms[roomId] = rooms[roomId].filter(user => user.id !== socket.id);
            io.to(roomId).emit("roomUsers", rooms[roomId]);
        }
    });
});


const PORT1 = process.env.PORT || 5000;
server.listen(PORT1, () => {
    console.log(`Main Server is running on http://localhost:${PORT1}`);
});

// === SECOND SERVER === //
const app2 = express();
app2.use(cors());

const server2 = http.createServer(app2);

app2.get('/', (req, res) => {
    res.send('Second Server is ready');
});

app2.use("/room", roomRoutes);

const PORT2 = 5001; // Different port
server2.listen(PORT2, () => {
    console.log(`Second Server is running on http://localhost:${PORT2}`);

});

// Use room routes