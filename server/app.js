const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const io = socketIo(server);

//--------------//

const playerAmount = 2;

let waitingClients = [];
const rooms = [];

io.on("connection", socket => {
    console.log("Client " + socket.id + " connected.");
    if (waitingClients.length === playerAmount-1) {
        const gameIndex = rooms.length;
        socket.join(gameIndex);
        waitingClients.forEach(c => c.join(gameIndex));
        rooms.push(gameIndex);
        io.to(gameIndex).emit('setGameRoom', gameIndex);
        waitingClients = [];
    } else {
        waitingClients.push(socket);
        waitingClients.forEach(c => io.to(c.id).emit('playersUntilStart', playerAmount - waitingClients.length))
    }

    socket.on('updateText', (newText) => {
        const rooms = socket.rooms && Object.keys(socket.rooms).filter(roomName => roomName !== socket.id);
        if (rooms) io.to(rooms[0]).emit('updateText', newText);
    });

    socket.on('disconnecting', () => {
        const rooms = socket.rooms && Object.keys(socket.rooms).filter(roomName => roomName !== socket.id);
        if (rooms) io.to(rooms[0]).emit('alone');
    });

    socket.on("disconnect", () => {
        console.log("Client " + socket.id + " disconnected.");
        if (waitingClients.map(c => c.id).includes(socket.id))
            waitingClients.splice(waitingClients.map(c => c.id).indexOf(socket.id), 1);
        waitingClients.forEach(c => io.to(c.id).emit('playersUntilStart', playerAmount - waitingClients.length));
    });
});

server.listen(port, () => console.log(`Server up on port ${port}`));
