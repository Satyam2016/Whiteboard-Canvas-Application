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

let roomIdGlobal, imgURLGlobal;

io.on('connection', (socket) => {
    socket.on('UserJoined', (roomData) => {
        console.log('UserJoined', roomData);
        roomIdGlobal = roomData.roomId;
        socket.join(roomData.roomId);
        const users = addUser(roomData);
        socket.emit("userIsJoined", { success: true, users });
        socket.broadcast.to(roomData.roomId).emit("allUsers", users);
        socket.broadcast.to(roomData.roomId).emit('whiteboardDataResponse', {
            imgURL: imgURLGlobal,
        });
    });

    socket.on('whiteboardData', (data) => {
        imgURLGlobal = data;
        socket.broadcast.to(roomIdGlobal).emit('whiteboardDataResponse', {
            imgURL: data,
        });
    });

    socket.on('newUserJoined', (data) => {
        console.log("New User Joined", data);
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