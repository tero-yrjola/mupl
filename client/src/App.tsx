import React, { useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import Lobby from './components/Lobby';
import getGameMode from './gameModes';

const backend = 'mupl.herokuapp.com';
let socket: SocketIOClient.Socket;

export type SelectedGameModes = {
    playerCounts: number[];
    gameModes: string[];
};

function App() {
    const [playersConnected, setPlayersConnected] = useState<number>(-1);
    const [game, setGame] = useState<JSX.Element>();

    const startGame = (mode: string, room: number) => {
        setGame(getGameMode(mode, room));
    };

    const connect = ({ playerCounts, gameModes }: SelectedGameModes) => {
        socket = io(backend);
        socket.on('connect', () => {
            console.log(
                `Connected to server. Your id is ${socket.id} and you're looking for games [${gameModes}] for [${playerCounts}] players.`,
            );
            socket.emit('lookingForGame', { playerCounts, gameModes });
        });
        socket.on('playersUntilStart', (amount: number) => setPlayersConnected(amount));
        socket.on('startGame', (mode: string, gameRoom: number) => startGame(mode, gameRoom));
        socket.on('print', (data: string) => console.log(data));
    };

    return <div className="App">{game ? game : <Lobby connect={connect} playersConnected={playersConnected} />}</div>;
}

export default App;
