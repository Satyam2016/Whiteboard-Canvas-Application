import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ClipboardDocumentIcon, 
  ArrowPathIcon,
  PlusCircleIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import uuid from "../uuid";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import socket from "../socket";

export default function CreateRoomForm({ setRooms, rooms }) {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState(generateRoomId());
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(null);
  const { user } = useAuth();

  function generateRoomId() {
    return uuid();
  }

  const showMessage = (type, title, text) => {
    setMessage({ type, title, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy room ID:", error);
      showMessage('error', 'Copy Failed', 'Failed to copy Room ID to clipboard.');
    }
  };

  const refreshRoomId = () => {
    setRoomId(generateRoomId());
    setCopied(false);
  };

  const createRoom = async () => {
    if (!roomName.trim()) {
      showMessage('warning', 'Room Name Required', 'Please enter a name for your room.');
      return;
    }

    setIsCreating(true);

    try {
      const roomData = {
        roomName: roomName.trim(),
        roomId: roomId,
        owner: user.uid,
        members: [user.uid],
        createdAt: new Date(),
        strokes: [],
        snapshot: "",
      };

      const docRef = await addDoc(collection(db, "Rooms"), roomData);
      
      // Update local state
      const newRoom = {
        id: docRef.id,
        ...roomData
      };
      setRooms([...rooms, newRoom]);

      // Join the room via socket
      socket.emit("createJoinRoom", { roomID: roomId, userID: user.uid });

      showMessage('success', 'Room Created!', 'Your room has been created successfully.');
      
      // Reset form
      setRoomName("");
      setRoomId(generateRoomId());
      setCopied(false);
      
    } catch (error) {
      console.error("Error creating room:", error);
      showMessage('error', 'Creation Failed', 'Failed to create room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createRoom();
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

        {/* Room Name Input */}
        <div>
          <label htmlFor="roomName" className="block text-sm font-medium text-slate-700 mb-2">
            Room Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            placeholder="Enter room name (e.g., Team Brainstorm)"
            disabled={isCreating}
            maxLength={50}
          />
          <p className="mt-2 text-xs text-slate-500">
            Choose a descriptive name for your whiteboard room.
          </p>
        </div>

        {/* Room ID Section */}
        <div>
          <label htmlFor="roomId" className="block text-sm font-medium text-slate-700 mb-2">
            Room ID
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <input
                type="text"
                id="roomId"
                value={roomId}
                readOnly
                className="block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm bg-slate-50 text-slate-700 font-mono text-sm"
              />
            </div>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={copyRoomId}
                className="p-3 text-slate-500 bg-white hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200 border border-slate-300"
                title="Copy Room ID"
              >
                {copied ? (
                  <CheckIcon className="w-4 h-4 text-green-600" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={refreshRoomId}
                className="p-3 text-slate-500 bg-white hover:text-slate-700 hover:bg-slate-100 rounded-lg duration-200 border border-slate-300"
                title="Generate New ID"
              >
                <ArrowPathIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            This unique ID will be used by others to join your room. {copied && (
              <span className="text-green-600 font-medium">ID copied to clipboard!</span>
            )}
          </p>
        </div>

        {/* Room Settings */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="text-sm font-medium text-slate-900 mb-3">Room Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Privacy</span>
              <span className="text-sm font-medium text-slate-900">Private</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Owner</span>
              <span className="text-sm font-medium text-slate-900">
                {user?.displayName || 'You'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Access</span>
              <span className="text-sm font-medium text-slate-900">Invite Only</span>
            </div>
          </div>
        </div>

        {/* Create Button */}
        <motion.button
          type="submit"
          disabled={!roomName.trim() || isCreating}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isCreating ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Creating Room...
            </div>
          ) : (
            <div className="flex items-center">
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              <span>Create Room</span>
            </div>
          )}
        </motion.button>

        {/* Additional Info */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="w-5 h-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-900">
                What happens next?
              </h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Your room will be created and you''ll be the owner</li>
                <li>• Share the Room ID with others to invite them</li>
                <li>• Start collaborating on your whiteboard immediately</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}