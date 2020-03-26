import React, {FormEvent, useState} from 'react';
/*import io from 'socket.io-client';
import '../App.css';

const backend = 'localhost:3000';*/
let socket: SocketIOClient.Socket;

interface SMChatProps {
    gameRoom: number,
}

function SMChat({gameRoom}: SMChatProps): JSX.Element {
    const [text] = useState('');
    const [localText, setLocalText] = useState('');
    const [messageCooldown, setMessageCooldown] = useState(false);

    /*const connect = () => {
        socket = io(backend);
        socket.on('connect', () => {
            console.log('Connected to a server. Your id is ' + socket.id);
        });
        socket.on('updateText', (newText: string) => setText(newText));
        socket.on('playerLeft', (playersRemaining: number) =>
            alert(`Another player left. ${playersRemaining} players left in the lobby. Refresh for a new game!`));
    };*/

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        socket.emit('updateText', localText.substring(0, 50));
        setLocalText('');
        setMessageCooldown(true);
        setTimeout(() => setMessageCooldown(false), 1000);
    };

    return (
        <div className="App">
            <p>You are in room {gameRoom} </p>
            <form autoComplete="off" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={localText}
                    maxLength={50}
                    onChange={(e) => setLocalText(e.target.value)}
                />
                <input disabled={messageCooldown} type="submit" value="Submit"/>
            </form>
            <h1>{text}</h1>
        </div>
    );
}

export default SMChat;
