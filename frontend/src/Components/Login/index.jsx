import { useState } from "react";
import { auth, googleProvider } from "../../firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard"); // ✅ Redirect after login
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username }); // ✅ Save username in Firebase Auth
      }
      navigate("/dashboard"); // ✅ Redirect after authentication
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <motion.div
        className="p-8 bg-white bg-opacity-30 backdrop-blur-lg rounded-xl shadow-lg w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {isLogin ? "Welcome Back!" : "Join Us Today!"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-50"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-50"
        />
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-50"
          />
        )}

        <motion.button
          onClick={handleAuth}
          className="bg-blue-600 text-white w-full py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLogin ? "Login" : "Sign Up"}
        </motion.button>

        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white w-full py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-red-600 transition duration-300 mt-4"
        >
          Sign in with Google
        </button>

        <p className="mt-6 text-gray-700 cursor-pointer hover:text-blue-500 transition duration-300" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
      </motion.div>
    </div>
  );
}
