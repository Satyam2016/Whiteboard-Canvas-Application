const express = require('express');
const cors = require('cors'); // Import cors
const app = express();

const server = require('http').createServer(app); 
const { Server } = require("socket.io");

const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/user');

// Apply CORS middleware
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "*", // Allow requests from any origin (adjust as needed)
        methods: ["GET", "POST"]
    }
});

// Routes
app.get('/', (req, res) => {
    res.send('Server is ready');
});

let roomIdGlobal, imgURLGlobal;

io.on('connection', (socket) => {
    socket.on('UserJoined', (roomData) => {
        console.log('UserJoined', roomData);
        const { name, userId, roomId, host, presenter } = roomData;
        roomIdGlobal = roomId;
        socket.join(roomData.roomId);
        const users = addUser(roomData);
        socket.emit("userIsJoined", { success: true, users });
        socket.broadcast.to(roomId).emit("allUsers", users);
        socket.broadcast.to(roomId).emit('whiteboardDataResponse', {
            imgURL: imgURLGlobal,
        });
    });

    socket.on('whiteboardData', (data) => {
        imgURLGlobal = data;
        socket.broadcast.to(roomIdGlobal).emit('whiteboardDataResponse', {
            imgURL: data,
        });
    });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
