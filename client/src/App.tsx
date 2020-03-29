import React, {useState} from 'react';
import io from 'socket.io-client';
import './App.css';
import Lobby from './components/Lobby';
import getGameMode from './gameModes';

let backend = process.env.NODE_ENV === 'production' ? 'mupl.herokuapp.com' : 'localhost:3001';
let socket: SocketIOClient.Socket;

export type SelectedGameModes = {
    playerCounts: number[];
    gameModes: string[];
};

export type QueueInfo = {
    name: string;
    playersUntilStart: { amount: number; playersUntilStart: number }[];
}[];

type StartGameResponse = {
    mode: string;
    room: number;
}

export type GameProps = StartGameResponse & { socket: SocketIOClient.Socket }

function App() {
    const [queueInfo, setQueueInfo] = useState<QueueInfo>([]);
    const [gameProps, setGameProps] = useState<GameProps>();


    const connect = ({playerCounts, gameModes}: SelectedGameModes) => {
        socket = io(backend);
        socket.on('connect', () => {
            console.log(
                `Connected to server. Your id is ${socket.id} and you're looking for games [${gameModes}] for [${playerCounts}] players.`,
            );
            socket.emit('lookingForGame', {playerCounts, gameModes});
        });
        socket.on('playersUntilStart', (queueInfo: QueueInfo) => setQueueInfo(queueInfo));
        socket.on('startGame', (response: StartGameResponse) => setGameProps({...response, socket}));
        socket.on('print', (data: string) => console.log(data));
        socket.on('disconnect', () => alert("Connection to the server lost."))
    };

    return <div className="App">
        {gameProps ? getGameMode(gameProps) :
        <Lobby connect={connect} queueInfo={queueInfo}/>}
    </div>;
}

export default App;
