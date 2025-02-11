import { useState } from "react";
import { motion } from "framer-motion";

export default function JoinRoomForm() {
  const [roomId, setRoomId] = useState("");

  // Join an existing room (Check if Room ID exists)
  const joinRoom = async () => {
     if (!joinRoomId.trim()) return;
     try {
       const q = query(collection(db, "Rooms"), where("__name__", "==", roomId));
       const querySnapshot = await getDocs(q);
       if (!querySnapshot.empty) {
         alert("Joined Room Successfully!");
       } else {
         alert("Room ID not found!");
       }
       setJoinRoomId("");
     } catch (error) {
       console.error("Error joining room:", error);
     }
   };

  return (
    <motion.div
      className="max-w-lg mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-xl font-bold mb-4 text-center">Join a Room</h2>

      {/* Room ID Input */}
      <div className="mb-4">
        <label className="block mb-1">Room ID</label>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
          placeholder="Enter Room ID"
        />
      </div>

      {/* Join Room Button */}
      <button
        onClick={joinRoom}
        className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white font-bold transition"
      >
        Join Room
      </button>
    </motion.div>
  );
}
