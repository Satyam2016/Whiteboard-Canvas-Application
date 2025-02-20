import { useEffect } from "react";
import { useAuth } from "../AuthContext";
import socket from "../socket";
import Swal from "sweetalert2";

export default function UserJoinedNotify(){
    const { user } = useAuth();

    useEffect(() => {
        socket.on("userJoined", ({ userID }) => {
            if (userID !== user.id) {
                Swal.fire({
                    title: "New User Joined!",
                    text: `${user.displayName} has joined the room.`,
                    icon: "info",
                    toast: true,
                    position: "top-right",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            }
        });

        return () => {
            socket.off("userJoined");
        };
    }, [user]);

    return null; // No UI needed, just handles notifications
};
