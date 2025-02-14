import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { motion } from "framer-motion";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";

import CreateRoomForm from "../../Components/CreateRoomForm";
import JoinRoomForm from "../../Components/JoinRoomForm";
import RoomCard from "../../Components/RoomCard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [rooms, setRooms] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 10; // Display 10 rooms per page

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserRooms();
    }
  }, [user]);

  const fetchUserRooms = async () => {
    try {
      const q = query(collection(db, "Rooms"));
      const querySnapshot = await getDocs(q);
      const fetchedRooms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(fetchedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Calculate pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-gray-800 rounded-xl shadow-md transition-all duration-300 hover:bg-gray-700 hover:shadow-lg">
        <motion.div 
          className="relative bg-gray-800"
          whileHover={{ scale: 1.05 }}
        >
        <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg transition duration-300 bg-gray-800 hover:bg-gray-700 hover:scale-105"
      >
        <img
          src={user?.photoURL || getInitialsAvatar()}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border border-gray-600 shadow-md"
        />
        <span className="hidden sm:inline-block font-semibold text-white">
          {user?.displayName || "User"}
        </span>
      </button>
      

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg borderbg-gray-800  hover:scale-105"
            >
              <button
                className="block px-4 py-2  w-full text-left transition duration-200 bg-gray-400 hover:bg-gray-600 hover:scale-105"
                onClick={() => setIsOpen(false)}
              >
                Edit Profile
              </button>
              <button
                className="block px-4 py-2 w-full text-left transition duration-200 bg-gray-400 hover:bg-gray-700 hover:scale-105"
                onClick={logout}
              >
                Logout
              </button>
            </motion.div>
          )}
        </motion.div>
        <motion.h1 
          className="text-2xl font-bold tracking-wide" 
          whileHover={{ scale: 1.1, color: "#facc15" }}
        >
          ✨ Whiteboard App
        </motion.h1>
      </nav>

      {/* Dashboard Sections */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Old Rooms Section */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">📂 Your Rooms</h2>
          {rooms.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentRooms.map((room, key) => (
                  <RoomCard key={key} room={room} />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={`px-4 py-2 rounded-md text-white font-semibold ${
                    currentPage === 1 ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={currentPage === 1}
                >
                  ⬅ Previous
                </button>
                <span className="text-gray-300">
                  Page {currentPage} of {Math.ceil(rooms.length / roomsPerPage)}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => (indexOfLastRoom < rooms.length ? prev + 1 : prev))
                  }
                  className={`px-4 py-2 rounded-md text-white font-semibold ${
                    indexOfLastRoom >= rooms.length ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={indexOfLastRoom >= rooms.length}
                >
                  Next ➡
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-400">No rooms found. Create or join one!</p>
          )}
        </div>

        {/* Join/Create Room Section */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">🚀 Join or Create Room</h2>

          {/* Join Room */}
          <JoinRoomForm />

          {/* Create Room */}
          <CreateRoomForm setRooms={setRooms} rooms={rooms} />
        </div>
      </div>
    </div>
  );
}
