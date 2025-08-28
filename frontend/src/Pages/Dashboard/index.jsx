import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import { 
  ChevronDownIcon, 
  UserCircleIcon, 
  PlusCircleIcon,
  FolderOpenIcon,
  UserIcon
} from "@heroicons/react/24/outline";

import CreateRoomForm from "../../Components/CreateRoomForm";
import JoinRoomForm from "../../Components/JoinRoomForm";
import RoomCard from "../../Components/RoomCard";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [rooms, setRooms] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms');
  const roomsPerPage = 8;

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserRooms();
    }
  }, [user]);

  const fetchUserRooms = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  // Calculate pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <h1 className="ml-3 text-xl font-semibold text-slate-900">
                  Whiteboard Pro
                </h1>
              </div>
            </div>

            {/* User Menu */}
            <div className="relative ">
              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-0 m-0 gap-2 px-2 bg-slate-200  rounded-lg hover:bg-slate-100 transition-colors duration-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
              
                <img
                  src={user?.photoURL}
                  alt="Profile"
                  className="w-8 h-8  rounded-full border border-slate-300"
                />
                <div className="hidden sm:block text-left ">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs  text-slate-500">
                    {user?.email}
                  </p>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-slate-500" />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg border border-slate-200 z-50"
                  >
                    <div className="py-2">
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 bg-white hover:bg-gray-500"
                        onClick={logout}
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-slate-600">
            Manage your whiteboards and collaborate with your team.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'rooms', label: 'My Rooms', icon: FolderOpenIcon },
                { id: 'create', label: 'Create Room', icon: PlusCircleIcon },
                { id: 'join', label: 'Join Room', icon: UserCircleIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm bg-slate-100 duration-200 hover:bg-blue-600 hover:text-black  ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'rooms' && (
            <motion.div
              key="rooms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Your Rooms ({rooms.length})
                  </h3>
                  <button
                    onClick={fetchUserRooms}
                    className="text-indigo-600 hover:text-indigo-900  bg-white text-sm font-medium"
                  >
                    Refresh
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                  </div>
                ) : rooms.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                      {currentRooms.map((room) => (
                        <RoomCard key={room.id} room={room} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                        <div className="text-sm text-slate-500">
                          Showing {indexOfFirstRoom + 1} to {Math.min(indexOfLastRoom, rooms.length)} of {rooms.length} rooms
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                  currentPage === page
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-500 hover:bg-slate-50'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setCurrentPage((prev) => (indexOfLastRoom < rooms.length ? prev + 1 : prev))}
                            disabled={indexOfLastRoom >= rooms.length}
                            className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FolderOpenIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-slate-900 mb-2">No rooms yet</h4>
                    <p className="text-slate-500 mb-4">
                      Create your first room or join an existing one to get started.
                    </p>
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleTabChange('create')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Create Room
                      </button>
                      <button
                        onClick={() => handleTabChange('join')}
                        className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-md hover:bg-slate-50 transition-colors"
                      >
                        Join Room
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Create New Room</h3>
              <CreateRoomForm setRooms={setRooms} rooms={rooms} />
            </motion.div>
          )}

          {activeTab === 'join' && (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Join Existing Room</h3>
              <JoinRoomForm />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}