import rough from "roughjs";
import React, { useEffect, useState, useLayoutEffect } from "react";
import {useAuth} from "../../AuthContext";
import socket from "../../socket";
import {useParams} from 'react-router-dom';


const roughGenerator = rough.generator();

const fetchRoomData = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:5001/room/${roomId}`);
      if(!response.ok) {
        return null;
      }
      return await response.json(); 
    } catch (error) {
      console.error("Error fetching room data:", error);
      return null;
    }
  };

const WhiteBoard = ({
    canvasRef,
    ctxRef,
    elements,
    setElements,
    color,
    tool
}) => {

    const [isDrawing, setIsDrawing] = useState(false);
    const {user} = useAuth();
    const [isViewer, setIsViewer] = useState(false);  // To track if the user is a viewer

    const {roomid} = useParams();
    
    const username = user.displayName;
    const userid = user.uid;




    useEffect(() => {
       
    }, [roomid, username, userid]);

    const handleDraw = (elements) => {
        console.log("Drawing in whiteboard", elements);
        socket.emit("draw", { roomid, elements });
    };

    useEffect(()=>{
        handleDraw(elements);

    }, [elements]);

    


    // Fetch room data and check if the user is a member
    useEffect(() => {
        const checkRoomAccess = async () => {
            const roomData = await fetchRoomData(roomid);
            console.log("roomData in white", roomData);
            if (roomData) {
                const members = roomData.data[0].members;
                console.log("members in white", members);
                if (!members.includes(user.uid)) {
                    setIsViewer(true);
                }
            }
        };
        checkRoomAccess();
    }, [roomid, user]);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.height = window.innerHeight * 2;
        canvas.width = window.innerWidth * 2;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;

        ctx.strokeStyle= color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
    }, []);

    useEffect(() => {
        ctxRef.current.strokeStyle = color;
    }, [color]);

    useLayoutEffect(() => {
        if(canvasRef){
            const roughCanvas = rough.canvas(canvasRef.current);

            if (elements.length > 0) {
                ctxRef.current.clearRect(
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                );
            }

            elements.forEach((ele) => {
                if (ele.type === "rectangle") {
                    const rectWidth = ele.width - ele.offsetX;
                    const rectHeight = ele.height - ele.offsetY;
                    roughCanvas.draw(
                        roughGenerator.rectangle(
                            ele.offsetX,
                            ele.offsetY,
                            rectWidth,
                            rectHeight,
                            {
                                stroke: ele.stroke,
                                strokeWidth: 2,
                                roughness: 0,
                            }
                        )
                    );
                } else if (ele.type === "pencil") {
                    roughCanvas.linearPath(ele.path,
                        {
                            stroke: ele.stroke,
                            strokeWidth: 2,
                            roughness: 0,
                        }
                    );
                } else if (ele.type === "line") {
                    roughCanvas.draw(
                        roughGenerator.line(
                            ele.offsetX,
                            ele.offsetY,
                            ele.width,
                            ele.height,
                            {
                                stroke: ele.stroke,
                                strokeWidth: 2 ,
                                roughness: 0,
                            }
                        )
                    );
                }
            });
        }

    }, [elements]);

    // Prevent non-members from drawing
    const handleMouseDown = (e) => {
        if (isViewer) return; // Restrict drawing for viewers

        const { offsetX, offsetY } = e.nativeEvent;

        if (tool === "pencil") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "pencil",
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: color,
                },
            ]);
        } else if (tool === "line") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "line",
                    offsetX,
                    offsetY,
                    width: offsetX,
                    height: offsetY,
                    stroke: color,
                },
            ]);
        } else if (tool === "rectangle") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    type: "rectangle",
                    offsetX,
                    offsetY,
                    width: offsetX,
                    height: offsetY,
                    stroke: color,
                },
            ]);
        }
        setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
        if (isViewer) return; // Prevent viewers from modifying elements

        const { offsetX, offsetY } = e.nativeEvent;

        if (isDrawing) {
            if (tool === "pencil") {
                const { path } = elements[elements.length - 1];
                const newPath = [...path, [offsetX, offsetY]];

                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                path: newPath,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            } else if (tool === "line") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX,
                                height: offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            } else if (tool === "rectangle") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) => {
                        if (index === elements.length - 1) {
                            return {
                                ...ele,
                                width: offsetX,
                                height: offsetY,
                            };
                        } else {
                            return ele;
                        }
                    })
                );
            }
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className={`bg-white rounded-lg border-gray-500 border-1 p-0 overflow-hidden h-screen w-screen 
                        ${isViewer ? "cursor-not-allowed" : "cursor-crosshair"}`}
        >
            <canvas   ref={canvasRef}></canvas>
            {isViewer && (
                <div className="absolute top-4 left-1 bg-red-500 text-white px-4 py-2 rounded-lg">
                    View-Only Mode
                </div>
            )}
        </div>
    );
};

export default WhiteBoard;
