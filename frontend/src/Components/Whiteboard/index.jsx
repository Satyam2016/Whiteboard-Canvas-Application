import rough from "roughjs";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { useAuth } from "../../AuthContext";
import socket from "../../socket";
import { useParams } from 'react-router-dom';

const roughGenerator = rough.generator();

const fetchRoomData = async (roomId) => {
    try {
        const response = await fetch(`http://localhost:5001/room/${roomId}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error fetching room data:", error);
        return null;
    }
};

const WhiteBoard = ({ canvasRef, ctxRef, elements, setElements, color, tool }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const { user } = useAuth();
    const [isViewer, setIsViewer] = useState(false);
    const { roomid } = useParams();

    useEffect(() => {
        const checkRoomAccess = async () => {
            const roomData = await fetchRoomData(roomid);
            if (roomData) {
                const members = roomData.data[0].members;
                setIsViewer(!members.includes(user.uid));
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
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
    }, []);

    useEffect(() => {
        ctxRef.current.strokeStyle = color;
    }, [color]);

    useEffect(() => {
        socket.on("receiveDraw", ([...receivedElements]) => {
            setElements([...receivedElements]);

        });

        return () => socket.off("receiveDraw");
    }, [elements]);

    useLayoutEffect(() => {
        if (canvasRef.current) {
            const roughCanvas = rough.canvas(canvasRef.current);

            elements.forEach((ele) => {
                if (ele.type === "rectangle") {
                    roughCanvas.draw(roughGenerator.rectangle(ele.offsetX, ele.offsetY, ele.width - ele.offsetX, ele.height - ele.offsetY, { stroke: ele.stroke, strokeWidth: 2, roughness: 0 }));
                } else if (ele.type === "pencil") {
                    roughCanvas.linearPath(ele.path, { stroke: ele.stroke, strokeWidth: 1, roughness: 0 });
                } else if (ele.type === "line") {
                    roughCanvas.draw(roughGenerator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, { stroke: ele.stroke, strokeWidth: 2, roughness: 0 }));
                }
            });
        }
    }, [elements]);

    useEffect(() => {
        if (!roomid || !user?.uid) return;
    
        // Emit event when the component mounts (soft refresh)
        socket.emit("createJoinRoom", { roomID: roomid, userID: user.uid });
    
        // Function to emit event on hard refresh
        const handleBeforeUnload = () => {
            socket.emit("createJoinRoom", { roomID: roomid, userID: user.uid });
        };
    
        // Attach event listener for hard refresh
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [roomid, user]);
    
    const updateElements = (updateFunc) => {
        setElements((prevElements) => {
            const newElements = updateFunc(prevElements);
            socket.emit("draw", { roomID: roomid, elements: newElements });
            return newElements;
        });
    };

    const handleMouseDown = (e) => {
        if (isViewer) return;
        const { offsetX, offsetY } = e.nativeEvent;

        updateElements((prev) => [
            ...prev,
            { type: tool, offsetX, offsetY, width: offsetX, height: offsetY, stroke: color, path: tool === "pencil" ? [[offsetX, offsetY]] : undefined },
        ]);
        setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
        if (isViewer || !isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;

        updateElements((prev) =>
            prev.map((ele, i) =>
                i === prev.length - 1
                    ? tool === "pencil"
                        ? { ...ele, path: [...ele.path, [offsetX, offsetY]] }
                        : { ...ele, width: offsetX, height: offsetY }
                    : ele
            )
        );
    };

    const handleMouseUp = () => setIsDrawing(false);

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className={`bg-white rounded-lg border-gray-500 border-1 p-0 overflow-hidden h-screen w-screen ${isViewer ? "cursor-not-allowed" : "cursor-crosshair"}`}
        >
            <canvas ref={canvasRef}></canvas>
            {isViewer && <div className="absolute top-4 left-1 bg-red-500 text-white px-4 py-2 rounded-lg">View-Only Mode</div>}
        </div>
    );
};

export default WhiteBoard;
