import io from "socket.io-client"

const server = "http://localhost:5000"
const connectionOptions = {
  "force new connection": true,
  "reconnectionAttempts": "Infinity",
  "timeout": 10000,
  "transports": ["websocket"]
}

const socket = io(server, connectionOptions)

export default socket;