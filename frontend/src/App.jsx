import { useState, useEffect } from 'react'
import './App.css'
import Forms from './components/Forms'
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

  const uuid=()=>{
    var s4=()=>{
      return Math.floor(((1+Math.random())*0x10000) | 0).toString(16).substring(1);
    }

    return s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4();
  }

  return (
    < div >
      <Routes>
        <Route path="/join" element={<Forms uuid={uuid}   socket={socket} setUser={setUser} />} />
        <Route path="/" element={<Home />} />
        <Route path="/loginSignup" element={<LoginSignup />} />
       
        <Route path="/loginSignup" element={<LoginSignup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
   
        <Route path="/:roomId"  element={<RoomPage user={user} socket={socket} users={users} />} />
      </Routes>
    </div>
  )
}

export default App
