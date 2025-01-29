import { useRef, useState } from "react";
import { IoIosUndo, IoIosRedo, IoIosColorPalette } from "react-icons/io";
import { FaPencil, FaEraser, FaShapes } from "react-icons/fa6";
import { MdLineWeight } from "react-icons/md";
import { TbTextResize } from "react-icons/tb";
import WhiteBoard from "../../Components/Whiteboard";
import "./index.css";

const RoomPage = ({ user, socket , users}) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [history, setHistory] = useState([]);

  const availableColors = [
    "#000000",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F1C40F",
    "#9B59B6",
    "#E74C3C",
    "#7F8C8D",
  ];

  const [openedUserTab, setOpenedUserTab] = useState(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    <div className="bg-slate-400 flex flex-col h-screen items-center">
    <button type="button" claaName="btn btn-dark position-absolute top-0 left-0 bg-blue-200" onClick={() => setOpenedUserTab(!openedUserTab)}>
          Users
    </button>
    {openedUserTab && (
      <div className="bg-white flex flex-col items-center m-2 rounded-lg font-mono text-1xl h-12 w-4/6 text-gray-500 px-2 border-gray-500 border-1">
        <h1 className="text-2xl text-black font-mono">Users</h1>
        {users.map((usr) => (
          <div key={usr.userId} className="flex justify-between items-center w-full">
            <p>{usr.name} {user && user.userId===usr.userId  && "(You)" }</p>
            <p>{usr.presenter ? "Presenter" : "Viewer"}</p>
          </div>
        ))}
      </div>
    )
    }
    <h1 className="text-3xl text-white font-mono">Room: {user?.roomId}  Users: {users?.length} </h1>
      {/* Toolbar */}
      {user?.presenter && (
        <div className="bg-white flex justify-between items-center m-2 rounded-full font-mono text-1xl h-12 w-4/6 text-gray-500 px-2 border-gray-500 border-1">
          {/* Undo/Redo */}
          <div className="flex gap-2 justify-start items-center px-2">
            <IoIosUndo
              className={`cursor-pointer h-5 w-5 hover:text-blue-500 ${
                elements.length === 0 && "text-gray-300"
              }`}
              title="Undo"
              onClick={Undo}
            />
            <IoIosRedo
              className={`cursor-pointer h-5 w-5 hover:text-blue-500 ${
                history.length === 0 && "text-gray-300"
              }`}
              title="Redo"
              onClick={Redo}
            />
          </div>

          {/* Tools */}
          <div className="flex justify-center items-center gap-2">
            <FaPencil
              className={`cursor-pointer h-5 w-5 ${
                tool === "pencil" && "text-blue-500"
              }`}
              title="Pencil"
              onClick={() => setTool("pencil")}
            />
            <MdLineWeight
              className={`cursor-pointer h-5 w-5 ${
                tool === "line" && "text-blue-500"
              }`}
              title="Line"
              onClick={() => setTool("line")}
            />
            <FaEraser
              className={`cursor-pointer h-5 w-5 ${
                tool === "eraser" && "text-blue-500"
              }`}
              title="Eraser"
              onClick={() => setTool("eraser")}
            />

            {/* Color Picker */}
            <div className="color-picker-container">
              <IoIosColorPalette
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="cursor-pointer h-5 w-5 color-picker-button"
                title="Color Picker"
                style={{ color }}
              />
              {showColorPicker && (
                <div className="color-picker-dropdown">
                  {availableColors.map((color) => (
                    <div
                      key={color}
                      className="color-option"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                    ></div>
                  ))}
                </div>
              )}
            </div>

            <FaShapes
              className={`cursor-pointer h-5 w-5 ${
                tool === "rectangle" && "text-blue-500"
              }`}
              title="Rectangle"
              onClick={() => setTool("rectangle")}
            />
            <TbTextResize
              className={`cursor-pointer h-5 w-5 ${
                tool === "text" && "text-blue-500"
              }`}
              title="Text Box"
              onClick={() => setTool("text")}
            />
          </div>

          {/* Clear Button */}
          <div className="flex gap-1 justify-end">
            <button
              className="bg-red-500 px-2 rounded-full text-white h-8"
              onClick={clearCanvas}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Whiteboard */}
      <div className="bg-white flex flex-col justify-center items-center border-red-600 rounded-lg h-5/6 w-5/6 p-0">
        <WhiteBoard
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          elements={elements}
          setElements={setElements}
          tool={tool}
          color={color}
          user={user}
          socket={socket}
         
        />
      </div>
    </div>
  );
};

export default RoomPage;
