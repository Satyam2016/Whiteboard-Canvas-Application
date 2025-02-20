import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import cors from "cors";
import socket from "../socket";
import { useAuth } from "../AuthContext";


// Fetch Room Data


export default function JoinRoomForm() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const { user } = useAuth();

  const fetchRoomData = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:5001/room/${roomId.trim()}`);
      if(!response.ok) {
        return null;
      }
      return await response.json(); 
    } catch (error) {
      console.error("Error fetching room data:", error);
      return null;
    }
  };
  
  // Join an existing room (Check if Room ID exists)
  const joinRoom = async () => {
    if (!roomId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Room ID",
        text: "Please enter a valid Room ID.",
        timer: 3500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const roomData = await fetchRoomData(roomId);

      console.log("roomData in join", roomData);

      if (roomData) {
        Swal.fire({
          icon: "success",
          title: "Room Found!",
          text: "Redirecting you to the room...",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        socket.emit("createJoinRoom", { roomID: roomId, userID: user.uid });
        setTimeout(() => {
          navigate(`/room/${roomId}`);
        }, 3000);
        

      } else {
        Swal.fire({
          icon: "error",
          title: "Room Not Found",
          text: "The Room ID you entered does not exist!",
          timer: 4000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error checking room ID:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later!",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
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
