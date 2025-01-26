
import React from 'react';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';



const JoinRoomForm = ({
  uuid, socket, setUser
}) => {
     const [roomId, setRoomId] = useState('');  
      const [name, setName] = useState('');
      const navigate = useNavigate();

      const handleRoomJoin = (e) => {
            e.preventDefault();
            const roomData={
                  name,
                  roomId,
                  userId: uuid(),
                  host: false,
                  presenter: false,
            };
            setUser(roomData);
            navigate(`/${roomId}`);
            console.log(roomData);
            socket.emit('UserJoined', roomData);
      }


     return (
          <div className=" flex items-center  w-96 border rounded-lg justify-center text-white">
          <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Join Room</h1>
            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 text-lg border-2 border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Enter Room Code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="p-3 text-lg border-2 border-gray-700 rounded-lg bg-gray-700 text-gray-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleRoomJoin}
                className="py-3 px-6 bg-blue-500 text-lg font-medium rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>
     )
}
export default JoinRoomForm;