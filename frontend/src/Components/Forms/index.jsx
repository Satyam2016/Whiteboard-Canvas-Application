import "./index.css";
import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";
const Forms = () => {
     return (
          <div className="h-screen p-0  bg-[rgb(41,41,41)] text-[rgb(33,29,29)] justify-center items-center flex flex-row gap-40 ">
                    <CreateRoomForm />
                    <JoinRoomForm />

          </div>

     )
}

export default Forms;