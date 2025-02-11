import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRegCopy } from "react-icons/fa";

export default function RoomCard({ room }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const copyRoomId = () => {
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const enterRoom = () => {
    navigate(`/room/${room.roomId}`);
  };

  return (
    <motion.div
      className="bg-gray-700 p-2 rounded-md shadow-md text-white flex justify-between items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div>
        <h3 className="text-lg font-semibold">{room.roomName}</h3>
        <p className="text-sm text-gray-300">Owner: {room.owner}</p>
        <p className="text-xs text-gray-400">Created: {new Date(room.createdAt).toLocaleString()}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={copyRoomId}
          className="bg-blue-600 p-1 rounded-md hover:bg-blue-700 transition relative"
        >
          <FaRegCopy />
          {copied && (
            <span className="absolute top-[-25px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-1 py-1 rounded-md">
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
