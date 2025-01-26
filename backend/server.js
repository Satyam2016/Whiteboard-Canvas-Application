const express = require('express');
const app = express();

const server = require('http').createServer(app); 
const { Server } = require("socket.io");

const io = new Server(server);


//routes
app.get('/', (req, res) => {
     res.send('Server is ready');
     }
);

io.on('connection', (socket) => {
     socket.on('UserJoined', (roomData) => {
          console.log('UserJoined', roomData);
          socket.join(roomData.roomId);
          socket.emit("userIsJoined", {success: true});
     }
     );
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);  
});