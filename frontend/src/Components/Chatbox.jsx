import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import socket from "../socket";
import { useAuth } from "../AuthContext";
import { useParams } from "react-router-dom";

const Chatbox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const { roomid } = useParams();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    // Function to append message to chatbox
    const appendMessage = (text, sender) => {
        setMessages((prev) => [...prev, { text, sender }]);
    };

    // Send message to socket
    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        socket.emit("sendMessage", {
            roomID: roomid,
            message,
            userID: user.uid,
            userName: user.displayName.split(" ").slice(0, 2).join(" "),
        });

        
        setMessage(""); // Clear input after sending
    };

    // Listen for incoming messages
    useEffect(() => {
        console.log("Listening for incoming messages...");
        const receiveMessage = ({ userID, message, userName }) => {
            appendMessage(message, userID === user.uid ? "You" : userName);
            console.log(`📢 Message received from ${userName}: "${message}"`);
        };

        socket.on("receiveMessage", receiveMessage);

        return () => {
            console.log("Stopped listening for incoming messages...");
            socket.off("receiveMessage", receiveMessage);
        };
    }, [user.uid]);

    return (
        <>
            {!isOpen && (
                <button
                    className="fixed bottom-5 left-5 bg-blue-500 text-white p-3 rounded-full shadow-lg"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageCircle size={24} />
                </button>
            )}

            {isOpen && (
                <div className="w-72 h-[500px] bg-white rounded-lg shadow-lg overflow-hidden fixed bottom-5 left-5 z-10 flex flex-col">
                    {/* Chat Header */}
                    <div className="flex justify-between items-center bg-blue-300 text-white p-1">
                        <h2 className="text-xs">Chat</h2>
                        <button
                            className="cursor-pointer text-red-700 bg-blue-300 hover:scale-125 hover:bg-blue-400"
                            onClick={() => setIsOpen(false)}
                        >
                            Close
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-3 bg-gray-50 text-xs custom-scrollbar space-y-1">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`p-1 rounded-lg w-fit ${
                                    msg.sender === "You"
                                        ? "bg-blue-500 text-white self-end text-right ml-auto"
                                        : "bg-gray-300 text-black"
                                }`}
                            >
                                <span className="text-sm text-gray-600">{msg.sender}:</span> {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Input Box */}
                    <form className="flex p-2 border-t border-gray-300 bg-white" onSubmit={sendMessage}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 p-2 border rounded-md outline-none w-3/4"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="ml-2 bg-blue-500 text-white px-2 py-2 rounded-md">
                            Send
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbox;
