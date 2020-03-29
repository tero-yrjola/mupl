import React, {useState} from 'react';
import {QueueInfo, SelectedGameModes} from '../App';
import './Lobby.css';

const gameModes = ['singleMessageChat'];
const playerCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface LobbyProps {
    connect: (selectedGameModes: SelectedGameModes) => void;
    queueInfo: QueueInfo;
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

    const filteredGameTypes = (queueInfo: QueueInfo) => {
        return queueInfo.filter(mode => selectedGameModes.includes(mode.name))
            .map(gameType => {
                return {
                    name: gameType.name,
                    playersUntilStart: gameType.playersUntilStart
                        .filter(gameAmt => selectedPlayerCounts
                            .includes(gameAmt.amount))
                }
            })
    };

    return (
        <div className="lobby-container">
            {searching ? (
                <div className="lobby">
                    <h2>Selected game modes:</h2>
                    <div>
                        {queueInfo.length > 0 && filteredGameTypes(queueInfo).map(modeInfo =>
                            <div className="normal-text" key={modeInfo.name}>
                                <p>{modeInfo.name}</p>
                                <table className="queue-info-table">
                                    <thead>
                                    <td># of players</td>
                                    <td>Players until start</td>
                                    </thead>
                                    {modeInfo.playersUntilStart.map((playerCounts =>
                                            <tr>
                                                <td>{playerCounts.amount}</td>
                                                <td>{playerCounts.playersUntilStart}</td>
                                            </tr>
                                    ))}
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="lobby">
                    <h2 className="bold">Select game modes:</h2>
                    <div className="selection-container game-modes">
                        {gameModes.map((mode) => (
                            <div
                                onClick={() => {
                                    deleteIfExistsAddIfNot(mode, selectedGameModes, setSelectedGameModes);
                                }}
                                key={mode}
                            >
                                <input type="checkbox" onChange={() => null}
                                       checked={selectedGameModes.includes(mode)}/>
                                <span className="normal-text">{mode.replace(/([A-Z])/g, ' $1')}</span>
                            </div>
                        ))}
                    </div>
                    <h2 className="bold">Select the amount of players:</h2>
                    <div className="selection-container player-amount-selection">
                        {playerCounts.map((count) => (
                            <div
                                className="amount-checkbox"
                                onClick={() => {
                                    deleteIfExistsAddIfNot(count, selectedPlayerCounts, setSelectedPlayerCounts);
                                }}
                                key={count}
                            >
                                <input type="checkBox" onChange={() => null}
                                       checked={selectedPlayerCounts.includes(count)}/>
                                <div className="amount-checkbox-label normal-text">{count}</div>
                            </div>
                        ))}
                    </div>
                    <input className="submit-btn" type="button" value="Search" onClick={search}/>
                </div>
            )}
        </div>);
}

export default Lobby;
