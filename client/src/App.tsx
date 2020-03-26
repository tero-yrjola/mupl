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

type StartGameResponse = {
    mode: string;
    room: number;
}

export type GameProps = StartGameResponse & { socket: SocketIOClient.Socket }

function App() {
    const [playersConnected, setPlayersConnected] = useState<number>(-1);
    const [gameProps, setGameProps] = useState<GameProps>();

    const connect = ({ playerCounts, gameModes }: SelectedGameModes) => {
        socket = io(backend);
        socket.on('connect', () => {
            console.log(
                `Connected to server. Your id is ${socket.id} and you're looking for games [${gameModes}] for [${playerCounts}] players.`,
            );
            //socket.emit('lookingForGame', { playerCounts, gameModes });
        });
        socket.on('playersUntilStart', (amount: number) => setPlayersConnected(amount));
        socket.on('startGame', (response: StartGameResponse) => setGameProps({...response, socket}));
        socket.on('print', (data: string) => console.log(data));
    };

    return <div className="App"> {gameProps ? getGameMode(gameProps) : <Lobby connect={connect} playersConnected={playersConnected} />}</div>;
}

export default App;
