// import { Button } from "@/components/ui/button";
import { FaChalkboardTeacher, FaUsers, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import {useNavigate} from "react-router-dom";


export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <motion.h1 
        className="text-5xl font-bold text-gray-800 mb-6 text-center"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        Real-time Collaborative Whiteboard
      </motion.h1>
      
      <motion.p 
        className="text-lg text-gray-600 text-center max-w-2xl mb-6"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        Draw, collaborate, and manage permissions seamlessly using WebSockets and Firebase.
        Perfect for teams, classrooms, and brainstorming sessions.
      </motion.p>
      
      <div className="flex space-x-4">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-blue-700"
          onClick={() => navigate("/loginsignup")}
        >
          Get Started
        </button>
        <button className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-lg shadow-md hover:bg-gray-400">
          Learn More
        </button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <FeatureCard 
          icon={<FaChalkboardTeacher className="text-blue-600 text-4xl" />} 
          title="Live Collaboration" 
          description="Work together in real time with instant updates." 
        />
        <FeatureCard 
          icon={<FaUsers className="text-green-600 text-4xl" />} 
          title="Permission Control" 
          description="Manage who can draw and who can only view." 
        />
        <FeatureCard 
          icon={<FaClock className="text-purple-600 text-4xl" />} 
          title="Auto Save & Sync" 
          description="Your work is saved and synced automatically." 
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
    >
      {icon}
      <h3 className="text-xl font-semibold text-gray-800 mt-4">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </motion.div>
  );
}
