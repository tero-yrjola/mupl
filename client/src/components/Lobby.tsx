import React, {useState} from 'react';
import {QueueInfo, SelectedGameModes} from '../App';
import './Lobby.css';

const gameModes = ['singleMessageChat'];
const playerCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface LobbyProps {
    connect: (selectedGameModes: SelectedGameModes) => void;
    queueInfo: QueueInfo | undefined;
}

function Lobby({queueInfo, connect}: LobbyProps) {
    const [searching, setSearching] = useState(false);
    const [selectedGameModes, setSelectedGameModes] = useState<string[]>([...gameModes]);
    const [selectedPlayerCounts, setSelectedPlayerCounts] = useState<number[]>([...playerCounts]);

    const search = () => {
        if (selectedGameModes.length > 0 && selectedPlayerCounts.length > 0) {
            setSearching(true);
            connect({playerCounts: selectedPlayerCounts, gameModes: selectedGameModes});
        } else alert('Please pick at least one game mode and one amount of players.');
    };

    function deleteIfExistsAddIfNot<T>(id: T, state: T[], setState: (key: T[]) => any) {
        state.includes(id) ? setState(state.filter((i) => i !== id)) : setState([...state, id]);
    }

    return searching ? (
        <div className="lobby">
            <h2>Selected game modes:</h2>
            {selectedGameModes.map((mode) => (
                <p key={mode}>{mode}</p>
            ))}
            <h1>
                {queueInfo && queueInfo.map && queueInfo.map(modeInfo =>
                    <div key={modeInfo.name}>
                        <h2>{modeInfo.name}</h2>
                        {modeInfo.playersUntilStart.map((playerCounts =>
                            <p key={playerCounts.amount}>
                                {playerCounts.amount} players: {playerCounts.playersUntilStart} players missing!
                            </p>))}
                    </div>
                )}
            </h1>
        </div>
    ) : (
        <div className="lobby">
            <p className="bold">Select game modes:</p>
            <div className="selection-container game-modes">
                {gameModes.map((mode) => (
                    <div
                        onClick={() => {
                            deleteIfExistsAddIfNot(mode, selectedGameModes, setSelectedGameModes);
                        }}
                        key={mode}
                    >
                        <input type="checkbox" onChange={() => null} checked={selectedGameModes.includes(mode)}/>
                        <span>{mode}</span>
                    </div>
                ))}
            </div>
            <p className="bold">Select the amount of players:</p>
            <div className="selection-container player-amount-selection">
                {playerCounts.map((count) => (
                    <div
                        className="amount-checkbox"
                        onClick={() => {
                            deleteIfExistsAddIfNot(count, selectedPlayerCounts, setSelectedPlayerCounts);
                        }}
                        key={count}
                    >
                        <input type="checkBox" onChange={() => null} checked={selectedPlayerCounts.includes(count)}/>
                        <div className="amount-checkbox-label">{count}</div>
                    </div>
                ))}
            </div>
            <input type="button" value="Search" onClick={search}/>
        </div>
    );
}

export default Lobby;
