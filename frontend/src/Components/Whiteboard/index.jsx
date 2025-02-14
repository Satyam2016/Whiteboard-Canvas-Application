import rough from "roughjs";
import React, { useEffect, useState, useLayoutEffect } from "react";


const roughGenerator = rough.generator();

const WhiteBoard = ({
    canvasRef,
    ctxRef,
    elements,
    setElements,
    color,
    tool,
    user,
    socket
}) => {

    
    // if(false){
    //     return (
    //         <div className="bg-white rounded-lg border-gray-500 border-1 p-0 overflow-hidden h-100 w-100">
    //         <img src={img} alt="Real TIme sharing" 
    //         style={{width: "280%", 
    //             height: window.innerHeight * 2}}
    //         />
    //         </div>
    //     ); 
    // }
    
    const [isDrawing, setIsDrawing] = useState(false);
   

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

    const handleMouseDown = (e) => {
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
            className="bg-white rounded-lg border-gray-500 border-1 p-0 overflow-hidden h-screen w-screen cursor-crosshair"
        >
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default WhiteBoard;