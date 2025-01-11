import { useState } from 'react'
import './App.css'
import Forms from './components/Forms'
import RoomPage from './Pages/RoomPage'
import { Route , Routes } from 'react-router-dom' 

function App() {

  return (
    < div >
      <Routes>
        <Route path="/" element={<Forms />} />
        <Route path="/:roomId"  element={<RoomPage />} />
      </Routes>
    </div>
  )
}

export default App
