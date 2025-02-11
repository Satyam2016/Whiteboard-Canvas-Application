import { useState } from "react";
import { motion } from "framer-motion";
import { FaCopy, FaSync } from "react-icons/fa";
import uuid from "../uuid"
import {db} from "../firebaseConfig"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../AuthContext";


export default function CreateRoomForm({
  setRooms,
  rooms,
}) {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState(generateRoomId());
  const { user } = useAuth();

  function generateRoomId() {
    return uuid();
  }

  function copyRoomId() {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied!");
  }

  async function createRoom() {
    if (!roomName.trim()) {
      alert("Please enter a room name.");
      return;
    }

    try {
          const docRef = await addDoc(collection(db, "Rooms"), {
            roomName: roomName,
            roomId: roomId,
            owner: user.uid,
            members: [user.uid],
            createdAt: new Date(),
            strokes: [],
            snapshot: "",
          });
          setRooms([...rooms, { id: docRef.id, name: roomName, owner: user.uid, members: [user.uid] }]);
          setRoomName("");
          setRoomId("");
        } catch (error) {
          console.error("Error creating room:", error);
        }
    
    // Handle room creation logic
  }

  return (
    <motion.div
      className="max-w-lg mx-auto bg-gray-800 text-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="text-xl font-bold mb-4 text-center">Join or Create Room</h2>

      {/* Room Name Input */}
      <div className="mb-4">
        <label className="block mb-1">Room Name</label>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
          placeholder="Enter room name"
        />
      </div>

      {/* Room ID Input with Buttons */}
      <div className="mb-4 flex items-center space-x-2">
        <div className="flex-1">
          <label className="block mb-1">Room ID</label>
          <input
            type="text"
            value={roomId}
            readOnly
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>
        <button
          onClick={copyRoomId}
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          <FaCopy />
        </button>
        <button
          onClick={() => setRoomId(generateRoomId())}
          className="p-2 bg-green-600 hover:bg-green-700 rounded"
        >
          <FaSync />
        </button>
      </div>

      {/* Create Room Button */}
      <button
        onClick={createRoom}
        className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded text-white font-bold transition"
      >
        Create Room
      </button>
    </motion.div>
  );
}
