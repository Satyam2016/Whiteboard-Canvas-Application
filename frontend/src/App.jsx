import { useState, useEffect } from 'react'
import './App.css'
import RoomPage from './Pages/RoomPage'
import Dashboard from './Pages/Dashboard'
import Home from './Components/LandingPage'
import LoginSignup from './Components/Login'
import ProtectedRoute from './ProtectedRoute'
import { Route , Routes } from 'react-router-dom' 


function App() {
 
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
          <RoomPage />
          </ProtectedRoute>
        }
         />
      </Routes>
    </div>
  )
}

export default App
