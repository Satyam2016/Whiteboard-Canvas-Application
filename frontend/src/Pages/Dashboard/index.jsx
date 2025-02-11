import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { updateProfile } from "firebase/auth";
import { db } from "../../firebaseConfig";
import RoomPage from "../RoomPage";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

import CreateRoomForm from "../../Components/CreateRoomForm";
import JoinRoomForm from "../../Components/JoinRoomForm";
import RoomCard from "../../Components/RoomCard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const [newAvatar, setNewAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL || getInitialsAvatar());
  const [rooms, setRooms] = useState([]); // Stores user's old rooms
  const navigate = useNavigate();

  // Fetch old rooms when component mounts
  useEffect(() => {
    if (user) {
      fetchUserRooms();
    }
  }, [user]);

  // Fetch user's old rooms from Firestore
  const fetchUserRooms = async () => {
    try {
      const q = query(collection(db, "Rooms"));
      const querySnapshot = await getDocs(q);
      const fetchedRooms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(fetchedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Join an existing room (Check if Room ID exists)
  const joinRoom = async () => {
    if (!joinRoomId.trim()) return;
    try {
      const q = query(collection(db, "Rooms"), where("__name__", "==", joinRoomId));
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

  // Navigate to the room
  const roomEntry = () => {
    navigate(`/room/1234`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-gray-800 rounded-md">
        <div className="relative">
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
            <img src={user?.photoURL || getInitialsAvatar()} alt="User Avatar" className="w-10 h-10 rounded-full" />
            <span className="hidden sm:inline-block font-semibold">{user?.displayName || "User"}</span>
          </button>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-md"
            >
              <button
                className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
                onClick={() => {
                  setIsEditing(true);
                  setIsOpen(false);
                }}
              >
                Edit Profile
              </button>
              <button className="block px-4 py-2 hover:bg-red-500 hover:text-white w-full text-left" onClick={logout}>
                Logout
              </button>
            </motion.div>
          )}
        </div>
        <h1 className="text-xl font-bold">Whiteboard App</h1>
      </nav>

      {/* Dashboard Sections */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Old Rooms Section */}
        <div className="bg-gray-800 p-6 rounded-md">
          <h2 className="text-lg font-semibold mb-4">Your Rooms</h2>
          {rooms.length > 0 ? (
            <ul className="space-y-1">
              {rooms.map((room) => (
               
                    <RoomCard room={room} />
              
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No rooms found.</p>
          )}
        </div>

        {/* Join/Create Room Section */}
        <div className="bg-gray-800 p-6 rounded-md">
          <h2 className="text-lg font-semibold mb-4">Join or Create Room</h2>

          {/* Join Room */}
          <JoinRoomForm />

          {/* Create Room */}
         <CreateRoomForm  setRooms={setRooms}  rooms={rooms}/>
        </div>
      </div>
    </div>
  );
}
