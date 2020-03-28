import * as SocketIO from "socket.io";
import {getAllPossibleGameModes, getPlayersUntilStartForEachGame} from "./Helper";

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);

const io = socketIo(server);

//--------------//


const possibleGameModes = ['singleMessageChat'];
const possiblePlayerAmounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const clientIdQueuedGameTypes = getAllPossibleGameModes(possibleGameModes, possiblePlayerAmounts);

let waitingClientIds: string[] = [];
const rooms: string[][] = [];

const updatePlayersUntilStartForWaitingClients = () => {
    const playersUntilStartForEachGame = getPlayersUntilStartForEachGame(clientIdQueuedGameTypes);
    let readyGameType = '';
    playersUntilStartForEachGame.forEach(modeQueueInfo => {
        modeQueueInfo.playersUntilStart.forEach(playerAmount => {
            if (playerAmount.playersUntilStart === 0) {
                readyGameType = modeQueueInfo.name
            }
        })
    });
    console.log(waitingClientIds);
    console.log("readyGameType is " + readyGameType)
    let newRoomCreated = false;
    let clientsInNewRoom: string[] = [];
    [...waitingClientIds].forEach(waitingClientId => {
        // If there is a gametype ready to start, start the game for all the waiting clients in that gametype
        if (readyGameType) {
            console.log("emitting to " + waitingClientId + "that room is " + rooms.length+1)
            io.to(waitingClientId).emit('startGame', {mode: readyGameType, room: rooms.length+1});
            clientsInNewRoom.push(waitingClientId);
            removeClientFromWaiting(waitingClientId);
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

io.on("connection", (socket: SocketIO.Socket) => {
    console.log("Client " + socket.id + " connected.");
    socket.on('lookingForGame', ({playerCounts, gameModes}: { playerCounts: number[], gameModes: string[] }) => {
        // Push the client id to each queued gametype (gametype = every queued player amount for each gamemode)
        gameModes.forEach(mode => {
            playerCounts.forEach(count => {
                clientIdQueuedGameTypes[mode][count].push(socket.id)
            });
        });

        // Push to actual client socket to waitingClient list for future usage
        waitingClientIds.push(socket.id);

        // Go through all the waiting clients and count how many players left until start for each gametype
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
        waitingClientIds.forEach(waitingClientIds => io.to(waitingClientIds).emit('playersUntilStart', -1));
    });
});

server.listen(port, () => console.log(`Server up on port ${port}`));
