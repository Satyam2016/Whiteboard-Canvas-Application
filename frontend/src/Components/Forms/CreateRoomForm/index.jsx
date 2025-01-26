
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const CreateRoomForm = ({
     uuid,
     socket, setUser
}) => {
     const [name, setName] = useState('');
     const [roomId, setRoomId] = useState(uuid());
     const navigate = useNavigate();

     const handleCreateRoom = (e) => {
          e.preventDefault();
          const roomData={
               name,
               roomId,
               userId: uuid(),
               host: true,
               presenter: true,

          };
          setUser(roomData);
          navigate(`/${roomId}`);
          console.log(roomData);
          socket.emit('UserJoined', roomData);
     }

     
     return (
          <div className=" flex  border rounded-lg items-center  w-auto justify-center text-white">
               <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-6">Create Room</h1>
                    <form className="flex flex-col gap-4">
                         <input
                              type="text"
                              placeholder="Enter Your Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="p-3 text-lg border-2 border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"

                         />
                         <div className="flex flex-row w-full">
                              <input
                                   type="text"
                                   placeholder="Generated Code"
                                   disabled
                                   value={roomId}
                                   className="p-3 text-lg border-2 border-gray-700 rounded-l-lg bg-gray-700 text-gray-400 focus:outline-none"

                              />
                              <button
                                   type="button"
                                   onClick={() => setRoomId(uuid())}

                                   className="py-1 px-2 bg-blue-400 text-lg font-medium hover:bg-blue-600 transition-transform transform " 
                              >
                              Generate
                              </button>
                              <button
                                   type="button"
                                   onClick={() => navigator.clipboard.writeText(roomId)}

                                   className="py-3 px-2 bg-red-500 text-lg font-medium rounded-r-lg hover:bg-blue-600 transition-transform transform hover:scale-105" 
                              >
                                   Copy
                              </button>
                         </div>

                         <button
                              type="button"
                             onClick={handleCreateRoom}
                              className="py-3 px-6 bg-blue-500 text-lg font-medium rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
                         >
                              Generate Room
                         </button>
                    </form>
               </div>
          </div>
     )
}
export default CreateRoomForm;