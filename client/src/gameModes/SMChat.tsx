import React, { FormEvent, useState } from 'react';

let socket: SocketIOClient.Socket;

interface SMChatProps {
    gameRoom: number;
}

function SMChat({ gameRoom }: SMChatProps): JSX.Element {
    const [text] = useState('');
    const [localText, setLocalText] = useState('');
    const [messageCooldown, setMessageCooldown] = useState(false);

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
                <input disabled={messageCooldown} type="submit" value="Submit" />
            </form>
            <h1>{text}</h1>
        </div>
    );
}

export default SMChat;
