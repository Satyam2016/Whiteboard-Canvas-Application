import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ClipboardDocumentIcon, 
  ArrowRightIcon,
  UserIcon,
  CalendarIcon,
  CheckIcon
} from "@heroicons/react/24/outline";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import socket from "../socket";
import { useAuth } from "../AuthContext";

export default function RoomCard({ room }) {
  const [copied, setCopied] = useState(false);
  const [ownerName, setOwnerName] = useState("Loading...");
  const [isEntering, setIsEntering] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();

  // Function to copy Room ID
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(room.roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy room ID:", error);
    }
  };

  // Navigate to the room
  const enterRoom = async () => {
    setIsEntering(true);
    try {
      socket.emit("createJoinRoom", { roomID: room.roomId, userID: user.uid });
      navigate(`/room/${room.roomId}`);
    } catch (error) {
      console.error("Error entering room:", error);
      setIsEntering(false);
    }
  };

  // Fetch the owner's display name from Firestore
  useEffect(() => {
    const fetchOwnerName = async () => {
      if (!room.owner) {
        setOwnerName("Unknown User");
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "Users", room.owner));
        if (userDoc.exists()) {
          setOwnerName(userDoc.data().displayName || "Unknown User");
        } else {
          setOwnerName("Unknown User");
        }
      } catch (error) {
        console.error("Error fetching owner name:", error);
        setOwnerName("Unknown User");
      }
    };

    fetchOwnerName();
  }, [room.owner]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    
    let date;
    if (timestamp.seconds) {
      // Firestore Timestamp
      date = new Date(timestamp.seconds * 1000);
    } else {
      // Regular Date
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      {/* Room Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
            {room.roomName || "Untitled Room"}
          </h4>
          <div className="flex items-center text-sm text-slate-500 mt-1">
            <UserIcon className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{ownerName}</span>
          </div>
        </div>
        <div className="ml-3 flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center">
            <span className="text-indigo-600 font-semibold text-sm">
              {room.roomName ? room.roomName.charAt(0).toUpperCase() : 'R'}
            </span>
          </div>
        </div>
      </div>

      {/* Room Details */}
      <div className="flex items-center text-xs text-slate-500 mb-4">
        <CalendarIcon className="w-3 h-3 mr-1" />
        <span>Created {formatDate(room.createdAt)}</span>
      </div>

      {/* Room ID */}
      <div className="bg-slate-50 rounded-md p-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-slate-600 block mb-1">Room ID</span>
            <span className="text-sm font-mono text-slate-900 truncate block">
              {room.roomId}
            </span>
          </div>
          <button
            onClick={copyRoomId}
            className="ml-2 p-1.5  bg-white  hover:text-slate-600 hover:bg-slate-200 rounded transition-colors duration-200"
            title="Copy Room ID"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4 text-green-600" />
            ) : (
              <ClipboardDocumentIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={copyRoomId}
          className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          {copied ? (
            <>
              <CheckIcon className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
              Copy ID
            </>
          )}
        </button>
        
        <button
          onClick={enterRoom}
          disabled={isEntering}
          className="flex-1 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          {isEntering ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Enter</span>
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}