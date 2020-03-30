import React from 'react';
import SMChat from './SMChat';
import { GameProps } from '../App';

export const getGameMode = (props: GameProps): JSX.Element => {
    switch (props.mode) {
        case 'singleMessageChat':
            return <SMChat gameRoom={props.room} socket={props.socket} />;
        default:
            return <p>Gamemode {props.mode} not found.</p>;
    }
};

export default getGameMode;
