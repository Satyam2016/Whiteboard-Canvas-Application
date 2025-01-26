import "./index.css";
import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";
const Forms = ({
     uuid,
     socket,
     setUser
}) => {
     return (
          <div className="h-screen p-0  bg-[rgb(41,41,41)] text-[rgb(33,29,29)] justify-center items-center flex flex-row gap-40 ">
                    <CreateRoomForm  uuid={uuid} socket={socket} setUser={setUser} />
                    <JoinRoomForm   uuid={uuid}  socket={socket} setUser={setUser} />

          </div>

     )
}

export default Forms;