import * as SocketIO from "socket.io";
import { getAllPossibleGameModes, getFirstReadyGameType, getPlayersUntilStartForEachGame } from "./Helper";

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);

const io = socketIo(server);

server.listen(port, () => console.log(`Server up on port ${port}`));

//--------------//


const possibleGameModes = ['singleMessageChat'];
const possiblePlayerAmounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const clientIdQueuedGameTypes = getAllPossibleGameModes(possibleGameModes, possiblePlayerAmounts);

let waitingClientIds: string[] = [];
const rooms: string[][] = [];

io.on("connection", (socket: SocketIO.Socket) => {
    console.log("Client " + socket.id + " connected.");
    socket.on('lookingForGame', ({playerCounts, gameModes}: { playerCounts: number[], gameModes: string[] }) => {
        gameModes.forEach(mode => {
            playerCounts.forEach(count => {
                clientIdQueuedGameTypes[mode][count].push(socket.id)
            });
        });

        waitingClientIds.push(socket.id);

        updatePlayersUntilStartForWaitingClients();
    });

    socket.on('updateText', (newText: string) => {
        rooms.find(room => room.some((clientId: string) => clientId === socket.id)).forEach(socketId => {
            io.to(socketId).emit('updateText', newText);
        });
    });

    socket.on('disconnecting', () => {
        removeClientFromWaiting(socket.id);
        updatePlayersUntilStartForWaitingClients();
    });

    socket.on("disconnect", () => {
        console.log("Client " + socket.id + " disconnected.");
        if (waitingClientIds.includes(socket.id))
            waitingClientIds.splice(waitingClientIds.indexOf(socket.id), 1);
    });
});


const updatePlayersUntilStartForWaitingClients = () => {
    const playersUntilStartForEachGame = getPlayersUntilStartForEachGame(clientIdQueuedGameTypes);
    const readyGameType = getFirstReadyGameType(playersUntilStartForEachGame);
    let newRoomCreated = false;
    let clientsInNewRoom: string[] = [];
    [...waitingClientIds].forEach(waitingClientId => {
        if (readyGameType) {
            startGame(waitingClientId, readyGameType);
            clientsInNewRoom.push(waitingClientId);
            newRoomCreated = true;
        } else {
            io.to(waitingClientId).emit('playersUntilStart', playersUntilStartForEachGame);
        }
    });
    if (newRoomCreated) {
        rooms.push(clientsInNewRoom);
        clientsInNewRoom = [];
        newRoomCreated = false;
    }
};


const startGame = (clientId: string, readyGameType: string) => {
    console.log(`Emitting to ${clientId} that their ${readyGameType}-room is ${rooms.length + 1}.`);
    io.to(clientId).emit('startGame', {mode: readyGameType, room: rooms.length + 1});
    removeClientFromWaiting(clientId);
};

const removeClientFromWaiting = (socketId: string) => {
    waitingClientIds.splice(waitingClientIds.indexOf(socketId), 1);
    possibleGameModes.forEach(mode => {
        possiblePlayerAmounts.forEach(amt => {
            const indexOfDisconnectingClient = clientIdQueuedGameTypes[mode][amt].indexOf(socketId);
            if (indexOfDisconnectingClient !== -1)
                clientIdQueuedGameTypes[mode][amt].splice(indexOfDisconnectingClient, 1);
        })
    });
};



