import React, { FormEvent, useState, useEffect } from 'react';

interface SMChatProps {
    gameRoom: number;
    socket: SocketIOClient.Socket;
}

function SMChat({ gameRoom, socket }: SMChatProps): JSX.Element {
    const [text, setText] = useState('');
    const [localText, setLocalText] = useState('');
    const [messageCooldown, setMessageCooldown] = useState(false);

    useEffect(() => {
        socket.on('updateText', (text: string) => setText(text));
    }, [socket]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        socket.emit('updateText', localText.substring(0, 50));
        setLocalText('');
        setMessageCooldown(true);
        setTimeout(() => setMessageCooldown(false), 1000);
    };

    return (
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
    );
}

export default SMChat;
