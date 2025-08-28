import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRightIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import socket from "../socket";
import { useAuth } from "../AuthContext";

export default function JoinRoomForm() {
  const [roomId, setRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const { user } = useAuth();

  const fetchRoomData = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:5001/room/${roomId.trim()}`);
      if (!response.ok) {
        return null;
      }
      return await response.json(); 
    } catch (error) {
      console.error("Error fetching room data:", error);
      return null;
    }
  };

  const showMessage = (type, title, text) => {
    setMessage({ type, title, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const joinRoom = async () => {
    if (!roomId.trim()) {
      showMessage('warning', 'Invalid Room ID', 'Please enter a valid Room ID.');
      return;
    }

    setIsJoining(true);

    try {
      const roomData = await fetchRoomData(roomId);

      if (roomData) {
        showMessage('success', 'Room Found!', 'Redirecting you to the room...');
        
        socket.emit("createJoinRoom", { roomID: roomId.trim(), userID: user.uid });
        
        setTimeout(() => {
          navigate(`/room/${roomId.trim()}`);
        }, 2000);
      } else {
        showMessage('error', 'Room Not Found', 'The Room ID you entered does not exist.');
      }
    } catch (error) {
      console.error("Error checking room ID:", error);
      showMessage('error', 'Connection Error', 'Something went wrong. Please try again later.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    joinRoom();
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getMessageBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Message Alert */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg border ${getMessageBgColor(message.type)}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getMessageIcon(message.type)}
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-slate-900">
                  {message.title}
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  {message.text}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Room ID Input */}
        <div>
          <label htmlFor="roomId" className="block text-sm font-medium text-slate-700 mb-2">
            Room ID
          </label>
          <div className="relative">
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Enter Room ID (e.g., abc123)"
              disabled={isJoining}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Ask the room owner for the Room ID to join their whiteboard session.
          </p>
        </div>

        {/* Join Button */}
        <motion.button
          type="submit"
          disabled={!roomId.trim() || isJoining}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isJoining ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Joining Room...
            </div>
          ) : (
            <div className="flex items-center">
              <span>Join Room</span>
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </div>
          )}
        </motion.button>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            Don''t have a Room ID?{' '}
            <button
              type="button"
              className="text-indigo-900 bg-gray-400 hover:text-indigo-700 font-medium"
              onClick={() => {
                // This would be handled by parent component to switch tabs
                // For now, just a placeholder
                console.log('Switch to create room tab');
              }}
            >
              Create a new room
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}