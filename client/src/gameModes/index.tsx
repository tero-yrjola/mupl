import React from "react";
import SMChat from "./SMChat";

export const getGameMode = (mode: string, gameRoom: number): JSX.Element => {
    switch (mode) {
        case "singleMessageChat":
            return <SMChat gameRoom={gameRoom}/>;
        default:
            return <p>Gamemode {mode} not found.</p>;
    }
};

export default getGameMode;