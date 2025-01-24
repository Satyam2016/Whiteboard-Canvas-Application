import rough from 'roughjs';
import React, { useEffect, useState, useLayoutEffect } from 'react';

const roughGenerator = rough.generator();


const WhiteBoard = ({
     canvasRef,
     ctxRef,
     elements,
     setElements,
}) => {

     const [isDrawing, setIsDrawing] = useState(false);
    
     useEffect(() => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          ctxRef.current = ctx;
     }, []);

     useLayoutEffect(()=>{
          const roughCanvas = rough.canvas(canvasRef.current);
          elements.forEach((ele) => {
              roughCanvas.linearPath(ele.path);
          });
     }, [elements]);

     const handleMouseDown = (e) => { 
          const { offsetX, offsetY } = e.nativeEvent;
          setElements((prevElements) => {
               return [
                    ...prevElements,
                    {
                        type: 'pencil',
                        offsetX,
                         offsetY,
                         path: [[  offsetX,  offsetY ]],
                         stroke: "black",
                    },
               ];
          });
          setIsDrawing(true);
     };
     const handleMouseMove = (e) => {
          console.log(elements);
          const { offsetX, offsetY } = e.nativeEvent;
          console.log(offsetX, offsetY);
      
          if (isDrawing) { 
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
          }
      };
      
     const handleMouseUp = (e) => {
          setIsDrawing(false);
     };
     return (
          
               <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="bg-white flex flex-col rounded-lg  h-full w-full   border-gray-500 border-1 p-0">
              
               </canvas>
     );
};

export default WhiteBoard;