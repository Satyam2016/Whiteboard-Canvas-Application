const express = require('express');
const cors = require('cors');
const http = require('http');
const { db } = require('./firebaseConfig');
const { Server } = require("socket.io");
const admin = require("firebase-admin");
const { getDocs, query, where, collection, updateDoc } = require("firebase/firestore");

// Utility functions for user management
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/user');

// Initialize Express app
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Health check route
app.get('/', (req, res) => {
    res.send('Main Server is running successfully!');
});

// ✅ Improved function for updating strokes in Firestore
const updateStrokes = async (roomId, elements) => {
    try {
        const roomQuery = db.collection("Rooms").where("roomId", "==", roomId);
        const querySnapshot = await roomQuery.get();

        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            let existingElements = querySnapshot.docs[0].data().strokes || [];

            // Merge strokes efficiently
            const newElements = [...existingElements, ...elements];

            await docRef.update({ strokes: newElements });

            console.log(`✅ Strokes updated successfully for Room: ${roomId}`);
        } else {
            console.log(`❌ No room found with ID: ${roomId}`);
        }
    } catch (error) {
        console.error("🔥 Error updating strokes:", error);
    }
};

// ✅ Socket.io connection handling
io.on("connection", (socket) => {
    console.log(`🟢 User connected socket-idw: ${socket.id}`);

    // Joining a room
    socket.on("createJoinRoom", async ({ roomID, userID }) => {
        try {
            const roomRef = db.collection("Channels").doc(roomID);
            const doc = await roomRef.get();

            if (!doc.exists) {
                await roomRef.set({
                    createdAt: new Date().toISOString(),
                    users: {}
                });
                console.log(`✅ Room ${roomID} created`);
            }

            // Join room & update user mapping
            socket.join(roomID);
            await roomRef.update({ [`users.${userID}`]: socket.id });

            console.log(`👤 User ${userID} joined Room: ${roomID}`);
            socket.emit("roomJoined", roomID);
            io.to(roomID).emit("userJoined", { userID, socketID: socket.id });

        } catch (error) {
            console.error(`🔥 Error in createJoinRoom: ${error}`);
        }
    });

    // ✅ Message handling
    socket.on("sendMessage", ({ roomID, message, userID, userName }) => {
        console.log(`💬 Message from ${userName}: "${message}" in Room ${roomID}`);
        io.in(roomID).emit("receiveMessage", { userID, message, userName });
    });

    // ✅ Drawing synchronization
    socket.on("draw", async ({ roomID, elements }) => {
        try {
            // await updateStrokes(roomID, elements); // Ensure strokes persist
            io.to(roomID).emit("receiveDraw", elements);
        } catch (error) {
            console.error(`🔥 Error in draw event: ${error}`);
        }
    });

    // ✅ Handling user disconnection
    socket.on("disconnect", async () => {
        console.log(`🔴 User disconnected: ${socket.id}`);

        const roomsRef = db.collection("Channels");
        const roomsSnapshot = await roomsRef.get();

        roomsSnapshot.forEach(async (roomDoc) => {
            const roomData = roomDoc.data();
            const users = roomData.users;

            for (const [userID, socketID] of Object.entries(users)) {
                if (socketID === socket.id) {
                    await roomDoc.ref.update({ [`users.${userID}`]: admin.firestore.FieldValue.delete() });
                    console.log(`👋 Removed user ${userID} from Room ${roomDoc.id}`);
                    io.to(roomDoc.id).emit("userLeft", { userID });
                    break;
                }
            }
        });
    });
});

// ✅ Server listening on port
const PORT1 = process.env.PORT || 5000;
server.listen(PORT1, () => {
    console.log(`🚀 Main Server running on http://localhost:${PORT1}`);
});

// === SECOND SERVER === //
const app2 = express();
app2.use(cors());

const server2 = http.createServer(app2);
app2.get('/', (req, res) => {
    res.send('Second Server is running successfully!');
});

// Include room routes
const roomRoutes = require("./routes/roomRoutes");
app2.use("/room", roomRoutes);

const PORT2 = 5001;
server2.listen(PORT2, () => {
    console.log(`🚀 Second Server running on http://localhost:${PORT2}`);
});
