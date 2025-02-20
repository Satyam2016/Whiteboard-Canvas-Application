const express = require('express');
const cors = require('cors');
const http = require('http');
const { db } = require('./firebaseConfig');
const { Server } = require("socket.io");
const roomRoutes = require("./routes/roomRoutes");
const admin = require("firebase-admin");

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


// Socket.io connection
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("createJoinRoom", async ({ roomID, userID }) => {
        const roomRef = db.collection("Channels").doc(roomID);
        const doc = await roomRef.get();

        if (!doc.exists) {
            await roomRef.set({
                createdAt: new Date().toISOString(),
                users: {}  // Map of users
            });
            console.log(`Room ${roomID} created`);
        }

        socket.join(roomID);

    
        await roomRef.update({
            [`users.${userID}`]: socket.id  // Map userID to socketID
        });

        console.log(`User ${userID} joined room ${roomID}`);
        socket.emit("roomJoined", roomID);
        io.to(roomID).emit("userJoined", { userID, socketID: socket.id }); // Notify others
    });


    socket.on("sendMessage", ({ roomID, message, userID }) => {
        io.to(roomID).emit("receiveMessage", { userID, message });
    });




    // disconnect
    socket.on("disconnect", async () => {
        console.log(`User disconnected: ${socket.id}`);
    
        const roomsRef = db.collection("Channels");
        const roomsSnapshot = await roomsRef.get();
    
        roomsSnapshot.forEach(async (roomDoc) => {
            const roomData = roomDoc.data();
            const users = roomData.users;
    
            for (const [userID, socketID] of Object.entries(users)) {
                if (socketID === socket.id) {
                    // Remove only the user, not the room
                    await roomDoc.ref.update({
                        [`users.${userID}`]: admin.firestore.FieldValue.delete()
                    });
    
                    console.log(`Removed user ${userID} from room ${roomDoc.id}`);
                    io.to(roomDoc.id).emit("userLeft", { userID });
    
                    break;
                }
            }
        });
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

