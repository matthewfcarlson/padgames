export interface IPlayerID {
    ID: string;
    DisplayName: string;
    paid: boolean;
}

export enum PlayerState {
    ACTIVE,
    LESSACTIVE,
    INACTIVE
}


export interface IPlayer {
    id: IPlayerID;
    status: PlayerState;
    isHost: boolean; // only one player should be allowed to be the host player
}