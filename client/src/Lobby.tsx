import React, { useState } from 'react';
import './App.css';

const gameModes = ['singleMessageChat'];

interface LobbyProps {
    connect: () => void;
    playersUntilStart: number;
}

function Lobby({ connect, playersUntilStart }: LobbyProps) {
    const [searching, setSearching] = useState(false);
    const [selectedGameModes, setSelectedGameModes] = useState([...gameModes]);

    const search = () => {
        if (selectedGameModes.length > 0) {
            connect();
            setSearching(true);
        } else alert('Please pick at least one game mode.');
    };

    return (
        <div className="App">
            {searching ? (
                <div>
                    <h2>Selected game modes:</h2>
                    {selectedGameModes.map((mode) => (
                        <p key={mode}>{mode}</p>
                    ))}
                    <h1>
                        {playersUntilStart
                            ? `Waiting for ${playersUntilStart} more ${playersUntilStart === 1 ? 'player' : 'players'}`
                            : 'Loading...'}
                    </h1>
                </div>
            ) : (
                <div>
                    {gameModes.map((mode) => (
                        <div
                            onClick={() => {
                                selectedGameModes.includes(mode)
                                    ? setSelectedGameModes(selectedGameModes.filter((m) => m !== mode))
                                    : setSelectedGameModes([...selectedGameModes, mode]);
                            }}
                            style={{ padding: '10px', cursor: 'default' }}
                            key={mode}
                        >
                            <input type="checkbox" onChange={() => {}} checked={selectedGameModes.includes(mode)} />
                            <span>{mode}</span>
                        </div>
                    ))}
                    <input type="button" value="Search" onClick={search} />
                </div>
            )}
        </div>
    );
}

export default Lobby;
