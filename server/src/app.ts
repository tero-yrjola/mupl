import * as SocketIO from "socket.io";

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);

const io = socketIo(server);

//--------------//

const playerAmount = 2;

let waitingClients: SocketIO.Socket[] = [];
const rooms: number[] = [];

io.on("connection", (socket: SocketIO.Socket) => {
    console.log("Client " + socket.id + " connected.");
    if (waitingClients.length === playerAmount-1) {
        const gameIndex = rooms.length;
        socket.join(gameIndex.toString());
        waitingClients.forEach(c => c.join(gameIndex.toString()));
        rooms.push(gameIndex);
        io.to(gameIndex.toString()).emit('setGameRoom', gameIndex);
        waitingClients = [];
    } else {
        waitingClients.push(socket);
        waitingClients.forEach(c => io.to(c.id).emit('playersUntilStart', playerAmount - waitingClients.length))
    }

    socket.on('updateText', (newText: string) => {
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
