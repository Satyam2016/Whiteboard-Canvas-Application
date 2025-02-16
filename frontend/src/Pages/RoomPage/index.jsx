import { useRef, useState, useEffect  } from "react";
import { IoIosUndo, IoIosRedo, IoIosColorPalette } from "react-icons/io";
import { FaPencil, FaEraser, FaShapes } from "react-icons/fa6";
import { MdLineWeight } from "react-icons/md";
import { TbTextResize } from "react-icons/tb";
import WhiteBoard from "../../Components/Whiteboard";
import { useAuth } from "../../AuthContext";
import { db } from "../../firebaseConfig";
import "./index.css";


const RoomPage = () => {
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [history, setHistory] = useState([]);
  const [roomName, setRoomName] = useState("Unknown Room");

  const availableColors = [
    "#000000", // Black
    "#FFFFFF", // White
    "#FF5733", // Vibrant Orange
    "#33FF57", // Bright Green
    "#3357FF", // Royal Blue
    "#F1C40F", // Golden Yellow
    "#9B59B6", // Purple
    "#E74C3C", // Red
  ];


  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    // Clear only the drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    setElements([]);
  };

  const Undo = () => {
    if (elements.length > 0) {
      const newHistory = [...history, elements[elements.length - 1]];
      setHistory(newHistory);
      setElements(elements.slice(0, -1));
    }
  };

  const Redo = () => {
    if (history.length > 0) {
      const newElements = [...elements, history[history.length - 1]];
      setElements(newElements);
      setHistory(history.slice(0, -1));
    }
  };

  const handleColorSelect = (selectedColor) => {
    setColor(selectedColor);
    setShowColorPicker(false);
  };

  return (
    <div className="relative h-screen w-screen bg-gray-900">


        {/* Toolbar */}

        <div className="toolbar-container fixed top-2 left-1/2 transform -translate-x-1/2 z-10 bg-gray-800 flex justify-between items-center rounded-full font-mono text-1xl h-12 w-5/6 text-white px-2 border-gray-700 border shadow-lg">

         
          {/* Undo/Redo */}

          <div className="flex gap-2 justify-start items-center px-2">
            <IoIosUndo
              className={`cursor-pointer h-5 w-5 hover:text-blue-400 ${elements.length === 0 && "text-gray-500"
                }`}
              title="Undo"
              onClick={Undo}
            />
            <IoIosRedo
              className={`cursor-pointer h-5 w-5 hover:text-blue-400 ${history.length === 0 && "text-gray-500"
                }`}
              title="Redo"
              onClick={Redo}
            />
          </div>

          {/* Tools */}
          <div className="flex justify-center items-center gap-2">
            <FaPencil
              className={`cursor-pointer h-5 w-5 ${tool === "pencil" ? "text-blue-400" : "text-white"
                }`}
              title="Pencil"
              onClick={() => setTool("pencil")}
            />
            <MdLineWeight
              className={`cursor-pointer h-5 w-5 ${tool === "line" ? "text-blue-400" : "text-white"
                }`}
              title="Line"
              onClick={() => setTool("line")}
            />
            <FaEraser
              className={`cursor-pointer h-5 w-5 ${tool === "eraser" ? "text-blue-400" : "text-white"
                }`}
              title="Eraser"
              onClick={() => setTool("eraser")}
            />

            {/* Color Picker */}
            <div className="relative">
              <IoIosColorPalette
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="cursor-pointer h-5 w-5"
                title="Color Picker"
                style={{ color }}
              />
              {showColorPicker && (
                <div className="absolute top-8 left-0 bg-gray-800 p-2 rounded-md shadow-md flex gap-1">
                  {availableColors.map((clr) => (
                    <div
                      key={clr}
                      className="w-6 h-6 rounded-full cursor-pointer border border-gray-500"
                      style={{ backgroundColor: clr }}
                      onClick={() => handleColorSelect(clr)}
                    ></div>
                  ))}
                </div>
              )}
            </div>

            <FaShapes
              className={`cursor-pointer h-5 w-5 ${tool === "rectangle" ? "text-blue-400" : "text-white"
                }`}
              title="Rectangle"
              onClick={() => setTool("rectangle")}
            />
            <TbTextResize
              className={`cursor-pointer h-5 w-5 ${tool === "text" ? "text-blue-400" : "text-white"
                }`}
              title="Text Box"
              onClick={() => setTool("text")}
            />
          </div>

          {/* Clear Button */}
          <div className="flex gap-1 justify-end">
            <button
              className="bg-red-500 px-2 rounded-full text-white h-8 hover:bg-red-700"
              onClick={clearCanvas}
            >
              Clear
            </button>
          </div>

           {/* User Info */}
           <div className="flex items-center space-x-2 hover:opacity-80 transition duration-200">
           <img src={user?.photoURL} alt="User Avatar" className="w-10 h-10 rounded-full border border-gray-600 shadow-md" />
           <span className="hidden sm:inline-block font-semibold">{user?.displayName || "User"}</span>
           </div>

        </div>


      {/* Whiteboard */}
      <div className="whiteboard-container absolute top-0 left-0 w-full h-full">
        <WhiteBoard
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          elements={elements}
          setElements={setElements}
          tool={tool}
          color={color}
        />
      </div>
    </div>
  );
};

export default RoomPage;
