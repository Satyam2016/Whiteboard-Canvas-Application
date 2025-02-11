import { createContext, useContext, useEffect, useState } from "react";
import { auth,  db } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
 
// Create Authentication Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const checkAndAddUser = async (uid, displayName) => {
    if (!uid || !displayName) return; // Safety check
  
    try {
      const userRef = doc(db, "Users", uid); // Reference to the user document
      const userSnap = await getDoc(userRef); // Fetch the user document
  
      if (!userSnap.exists()) {
        // If user does not exist, add them
        await setDoc(userRef, { uid , displayName });
        console.log("User added to Firestore:", { uid, displayName });
      } else {
        console.log("User already exists in Firestore");
      }
    } catch (error) {
      console.error("Error checking/adding user:", error);
    }
  };
  // Listen to authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Users", user);
      setUser(user);
      checkAndAddUser(user?.uid, user?.displayName);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Logout Function
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};
