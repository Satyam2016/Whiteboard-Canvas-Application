import { useState } from "react";

const RoomPage = () => {
  const [tool, setTool] = useState("pencil");
  
  return (
    <div className="row">
      <h1 className="text-center py-4">White Board Sharing App</h1>
      <div className="col-md-12 mt-4 mb-5 d-flex items-center justify-center">
        <div className=" bg-gray-300 d-flex col-md-4 justify-center gap-5">
          <label className="flex items-center ">
            <input
              type="radio"
              name="tool"
              value="pencil"
              onChange={(e) => setTool(e.target.value)}
              className="cursor-pointer"
            />
            Pencil
          </label>
          <label className="flex items-center ">
            <input
              type="radio"
              name="tool"
              value="line"
              onChange={(e) => setTool(e.target.value)}
              className="cursor-pointer"
            />
            Line
          </label>
          <label className="flex items-center ">
            <input
              type="radio"
              name="tool"
              value="rectangle"
              onChange={(e) => setTool(e.target.value)}
              className="cursor-pointer"
            />
            Rectangle
          </label>
        </div>
        <div>

        </div>
      </div>
    </div>
  );
};

export default RoomPage;
