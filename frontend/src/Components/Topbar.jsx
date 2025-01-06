import react from 'react'


function Topbar() {

     return (
       <div className=" bg-slate-400  flex  w-96 min-w-fit justify-center items-center h-16 rounded-full m-2 px-5 sticky gap-6 text-lg font-mono cursor-pointer text-white ">
         <a className="hover:scale-110 hover:text-black">
            Pen
         </a>
         <a className="hover:scale-110 hover:text-black">
         Eraser
         </a >
         <a  className="hover:scale-110 hover:text-black">
         Shape
         </a>
         <a  className="hover:scale-110 hover:text-black">
         Color
         </a>
         
       </div>
     )
   }
   
   export default Topbar