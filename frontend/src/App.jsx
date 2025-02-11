import { useState, useEffect } from 'react'
import './App.css'
import RoomPage from './Pages/RoomPage'
import Dashboard from './Pages/Dashboard'
import Home from './Components/LandingPage'
import LoginSignup from './Components/Login'
import ProtectedRoute from './ProtectedRoute'
import { Route , Routes } from 'react-router-dom' 

import io from "socket.io-client"

const server ="http://localhost:5000"
const connectionOptions={
  "force new connection":true,
  "reconnectionAttempts":"Infinity",
  "timeout":10000,
  "transports":["websocket"]
}
const socket =io(server, connectionOptions)



function App() {

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    socket.on('userIsJoined', (data)=>{
     if(data.success){
       console.log("User Joined")
        setUsers(data.users);
     }
     else{
        console.log("User not Joined")
     }
    })
    socket.on('allUsers', (data)=>{
      setUsers(data);
    })
  }, []);


  return (
    < div >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginSignup" element={<LoginSignup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
   
        <Route path="/room/:roomid"  element={
          <ProtectedRoute>
          <RoomPage user={user} socket={socket} users={users} />
          </ProtectedRoute>
        }
         />
      </Routes>
    </div>
  )
}

export default App
