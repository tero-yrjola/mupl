type PlayerAmounts = {
    [amountOfPlayers: string]: string[]
};

type AllGameTypes = {
    [gameMode: string]: PlayerAmounts
};

export const getAllPossibleGameModes = (gameModes: string[], playerAmounts: number[]): AllGameTypes =>
    gameModes.reduce((allGameTypes: AllGameTypes, gameType) => {
        allGameTypes[gameType] = playerAmounts.reduce((allPlayerAmounts: PlayerAmounts, playerAmount) => {
            allPlayerAmounts[playerAmount] = [];
            return allPlayerAmounts;
        }, {});
        return allGameTypes;
    }, {});

export const getPlayersUntilStartForEachGame = (queuedGameTypesForEachClient: AllGameTypes) => {
    const gameModes = Object.keys(queuedGameTypesForEachClient);
    return gameModes.map(mode => {
        const playerAmounts = Object.keys(queuedGameTypesForEachClient[mode]).map(amt => parseInt(amt));
        const playersUntilStart = playerAmounts.map(amount => {
            return {amount, playersUntilStart: (amount - queuedGameTypesForEachClient[mode][amount].length)}
        });
        return {name: mode, playersUntilStart}
    })
};
