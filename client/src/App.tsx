import React, { FormEvent, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import Lobby from './Lobby';

const backend = 'mupl.herokuapp.com';
let socket: SocketIOClient.Socket;

function App() {
    const [text, setText] = useState('');
    const [gameRoom, setGameRoom] = useState<number>();
    const [localText, setLocalText] = useState('');
    const [messageCooldown, setMessageCooldown] = useState(false);
    const [playersUntilStart, setPlayersUntilStart] = useState<number>(0);

    const connect = () => {
        socket = io(backend);
        socket.on('connect', () => {
            console.log('Connected to a server. Your id is ' + socket.id);
        });
        socket.on('setGameRoom', (room: number) => {
            setGameRoom(room);
            document.title = 'Chat online!';
        });
        socket.on('updateText', (newText: string) => setText(newText));
        socket.on('alone', () => alert('Your opponent left. Refresh for a new game!'));
        socket.on('playersUntilStart', (amount: number) => setPlayersUntilStart(amount));
        socket.on('print', (data: string) => console.log(data));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        socket.emit('updateText', localText.substring(0, 50));
        setLocalText('');
        setMessageCooldown(true);
        setTimeout(() => setMessageCooldown(false), 1000);
    };

    return (
        <div className="App">
            {gameRoom ? (
                <div>
                    <p>You are in room {gameRoom} </p>
                    <form autoComplete="off" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            value={localText}
                            maxLength={50}
                            onChange={(e) => setLocalText(e.target.value)}
                        />
                        <input disabled={messageCooldown} type="submit" value="Submit" />
                    </form>
                    <h1>{text}</h1>
                </div>
            ) : (
                <Lobby connect={connect} playersUntilStart={playersUntilStart} />
            )}
        </div>
    );
}

export default App;