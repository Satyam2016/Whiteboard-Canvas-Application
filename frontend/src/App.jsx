import { useState, useEffect } from 'react'
import './App.css'
import Forms from './components/Forms'
import RoomPage from './Pages/RoomPage'
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

  useEffect(()=>{
    socket.on('userIsJoined', (data)=>{
     if(data.success){
       console.log("User Joined")
     }
     else{
        console.log("User not Joined")
     }
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
        <Route path="/" element={<Forms uuid={uuid}   socket={socket} setUser={setUser} />} />
        <Route path="/:roomId"  element={<RoomPage user={user} />} />
      </Routes>
    </div>
  )
}

export default App
