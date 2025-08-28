import rough from "roughjs";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { useAuth } from "../../AuthContext";
import socket from "../../socket";
import { useParams } from "react-router-dom";

const roughGenerator = rough.generator();

// Fetch room data from backend
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
    const { user } = useAuth();
    const { roomid } = useParams();
    const [isDrawing, setIsDrawing] = useState(false);
    const [isViewer, setIsViewer] = useState(false);

    // Check if current user has drawing permissions in the room
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

    // Initialize canvas
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

    // Update stroke color when changed
    useEffect(() => {
        ctxRef.current.strokeStyle = color;
    }, [color]);

    // Listen for drawing updates from other users
    useEffect(() => {
        socket.on("receiveDraw", ([...receivedElements]) => {
            setElements([...receivedElements]);
        });
        return () => socket.off("receiveDraw");
    }, [elements]);

    // Render elements on the canvas
    useLayoutEffect(() => {
        if (!canvasRef) return;
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
            const opts = { stroke: ele.stroke, strokeWidth: 2, roughness: 0 };

            if (ele.type === "rectangle") {
                const rectWidth = ele.width - ele.offsetX;
                const rectHeight = ele.height - ele.offsetY;
                roughCanvas.draw(roughGenerator.rectangle(ele.offsetX, ele.offsetY, rectWidth, rectHeight, opts));
            } 
            else if (ele.type === "pencil") {
                roughCanvas.linearPath(ele.path, opts);
            } 
            else if (ele.type === "line") {
                roughCanvas.draw(roughGenerator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, opts));
            }
        });
    }, [elements]);

    // Join room when component mounts
    useEffect(() => {
        if (!roomid || !user?.uid) return;

        socket.emit("createJoinRoom", { roomID: roomid, userID: user.uid });

        const handleBeforeUnload = () => {
            socket.emit("createJoinRoom", { roomID: roomid, userID: user.uid });
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [roomid, user]);

    // Update and sync elements with server
    const updateElements = (updateFunc) => {
        setElements((prevElements) => {
            const newElements = updateFunc(prevElements);
            socket.emit("draw", { roomID: roomid, elements: newElements });
            return newElements;
        });
    };

    // Drawing event handlers
    const handleMouseDown = (e) => {
        if (isViewer) return;
        const { offsetX, offsetY } = e.nativeEvent;

        updateElements((prev) => [
            ...prev,
            {
                type: tool,
                offsetX,
                offsetY,
                width: offsetX,
                height: offsetY,
                stroke: color,
                path: tool === "pencil" ? [[offsetX, offsetY]] : undefined,
            },
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
            className={` rounded-lg border-gray-500 border-1 p-0 overflow-scroll w-screen h-screen ${
                isViewer ? "cursor-not-allowed" : "cursor-crosshair"
            }`}
        >
            <canvas ref={canvasRef}
            ></canvas>
            {isViewer && (
                <div className="absolute top-4 left-1 bg-red-500 text-white px-4 py-2 rounded-lg">
                    View-Only Mode
                </div>
            )}
        </div>
    );
};

export default WhiteBoard;
