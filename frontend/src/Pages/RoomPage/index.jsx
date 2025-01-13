import { useState } from "react";
import { IoIosUndo } from "react-icons/io";
import { IoIosRedo } from "react-icons/io";
import { FaPencil } from "react-icons/fa6";
import { FaEraser } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { FaShapes } from "react-icons/fa6";
import WhiteBoard from "../../Components/Whiteboard";

const RoomPage = () => {
     const [tool, setTool] = useState("pencil");

     return (
          <div className="bg-slate-400 flex flex-col h-screen items-center">
               <div className="bg-white flex justify-between items-center m-2 rounded-full  font-mono text-1xl h-12 w-4/6 text-gray-500  px-2 border-gray-500  border-1">
                    
                    <div className="flex gap-2 justify-start items-center px-2">
                         <IoIosUndo
                              className="cursor-pointer h-5 w-5"
                         />
                         <IoIosRedo
                              className="cursor-pointer h-5 w-5"
                         />
                    </div>
                    <div className="flex justify-center items-center gap-2 ">
                    <FaPencil
                    className="cursor-pointer h-5 w-5" />
                    <FaEraser
                    className="cursor-pointer h-5 w-5" />
                    <IoIosColorPalette 
                    className="cursor-pointer h-5 w-5"
                    />
                    <FaShapes
                    className="cursor-pointer h-5 w-5" />

                    </div>
                    <div className="flex gap-1 justify-end">
                    <button className="bg-red-500 px-2 rounded-full text-white h-8"
                    >
                   Clear
                    </button>
                        
                    </div>
               </div>

               <div className="bg-white flex flex-col justify-center items-center border-red-600 rounded-lg   h-5/6 w-5/6 p-0 ">
                    < WhiteBoard />
               </div>
          </div>
     );
};

export default RoomPage;

// <div className="col-md-12 mt-4 mb-5 d-flex items-center justify-center">
//         <div className=" bg-gray-300 d-flex col-md-4 justify-center gap-5">
//           <label className="flex items-center ">
//             <input
//               type="radio"
//               name="tool"
//               value="pencil"
//               onChange={(e) => setTool(e.target.value)}
//               className="cursor-pointer"
//             />
//             Pencil
//           </label>
//           <label className="flex items-center ">
//             <input
//               type="radio"
//               name="tool"
//               value="line"
//               onChange={(e) => setTool(e.target.value)}
//               className="cursor-pointer"
//             />
//             Line
//           </label>
//           <label className="flex items-center ">
//             <input
//               type="radio"
//               name="tool"
//               value="rectangle"
//               onChange={(e) => setTool(e.target.value)}
//               className="cursor-pointer"
//             />
//             Rectangle
//           </label>
//         </div>
//         <div>
//         </div>
//       </div>
