import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegCopy } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function RoomCard({ room }) {
  const [copied, setCopied] = useState(false);
  const [ownerName, setOwnerName] = useState("Unknown User");
  const navigate = useNavigate();

  // Function to copy Room ID
  const copyRoomId = () => {
    navigator.clipboard.writeText(room.roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Navigate to the room
  const enterRoom = () => {
    navigate(`/room/${room.roomId}`);
  };

  // Fetch the owner's display name from Firestore
  useEffect(() => {
    const fetchOwnerName = async () => {
      if (!room.owner) return;
      try {
        const userDoc = await getDoc(doc(db, "Users", room.owner));
        if (userDoc.exists()) {
          setOwnerName(userDoc.data().displayName);
        }
      } catch (error) {
        console.error("Error fetching owner name:", error);
      }
    };

    fetchOwnerName();
  }, [room.owner]);

  return (
    <motion.div
      className="bg-gray-700 p-4 rounded-md shadow-md text-white flex justify-between items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div>
        <h3 className="text-lg font-semibold">{room.roomName}</h3>
        <p className="text-sm text-gray-300">Owner: {ownerName}</p>
        <p className="text-xs text-gray-400">Created: {new Date(room.createdAt).toLocaleString()}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={copyRoomId}
          className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 transition relative"
        >
          <FaRegCopy />
          {copied && (
            <span className="absolute top-[-25px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded-md">
              Copied!
            </span>
          )}
        </button>
        
        <button
          onClick={enterRoom}
          className="bg-green-600 px-3 py-1 rounded-md hover:bg-green-700 transition"
        >
          Enter
        </button>
      </div>
    </motion.div>
  );
}
