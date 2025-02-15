
const { db } = require("../firebaseConfig"); 
const { collection, query, where, getDocs } = require("firebase/firestore");

const getRoomById = async (req, res) => {
    try {
        const { roomId } = req.params; // Get roomId from request parameters

        // Query Firestore collection
        const roomQuery = db.collection("Rooms").where("roomId", "==", roomId);
        const querySnapshot = await roomQuery.get();

        // 🔹 Check if room exists
        if (querySnapshot.empty) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Extract room data
        const roomData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return res.status(200).json({ status: "success", data: roomData });

    } catch (error) {
        console.error("Error fetching room:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



// Create a New Room
const createRoom = async (req, res) => {
    try {
        const { roomId, name, host } = req.body;

        if (!roomId || !name || !host) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const roomRef = db.collection("rooms").doc(roomId);
        await roomRef.set({ name, host, createdAt: new Date() });

        res.status(201).json({ message: "Room created successfully" });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getRoomById, createRoom };
