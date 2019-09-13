import { IPlayerID } from '../players/IPlayer';

export enum PlayerState {
    ACTIVE,
    LESSACTIVE,
    INACTIVE
}


export interface IPlayer {
    id: IPlayerID;
    status: PlayerState;
    isHost: boolean; //only one player should be allowed to be the host player
}

export interface IRoom {
    players: [IPlayer];

    /**
     * returns the index of the player that is currently the host
     */
    GetHostPlayer(): IPlayer;
}