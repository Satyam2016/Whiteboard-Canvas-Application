import { useState } from "react";
import { useAuth } from "../../AuthContext";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { updateProfile } from "firebase/auth";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const [newAvatar, setNewAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.photoURL || getInitialsAvatar());

  console.log(user);

  // Generate initial avatar if no profile picture is found
  const getInitialsAvatar = () => {
    const name = user?.displayName?.trim() || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
  };

  // Handle profile picture change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setNewAvatar(file);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      if (!user) return;

      let photoURL = user.photoURL ;
      
     //  // If a new avatar is uploaded, process it here
     //  if (newAvatar) {
     //    const formData = new FormData();
     //    formData.append("file", newAvatar);
     //    formData.append("upload_preset", "your_upload_preset"); // Use Cloudinary or Firebase Storage
     //    const response = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
     //      method: "POST",
     //      body: formData,
     //    });
     //    const data = await response.json();
     //    photoURL = data.secure_url; // Get uploaded image URL
     //  }

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: newName,
        photoURL,
      });

      // Force update UI (important!)
      window.location.reload();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white relative">
      {/* Left Side - Profile Section */}
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
          <img src={user?.photoURL } alt="User Avatar" className="w-10 h-10 rounded-full border border-gray-300" />
          <span className="hidden sm:inline-block font-semibold">{user?.displayName || "User"}</span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-md overflow-hidden"
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

      {/* Right Side - App Name */}
      <h1 className="text-lg font-bold">Whiteboard App</h1>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-96 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

            {/* Profile Picture Preview */}
            <div className="mb-4">
              <img src={preview} alt="Preview" className="w-20 h-20 mx-auto rounded-full border" />
            </div>

            {/* Name Input */}
            <input
              type="text"
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 border rounded-md mb-4 text-black"
            />

            {/* Upload Avatar */}
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />

            {/* Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleProfileUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </nav>
  );
}
