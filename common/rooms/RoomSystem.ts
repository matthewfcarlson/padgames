import { IPlayerID } from '../players/IPlayer';



export interface IPlayer {
    id: IPlayerID;
    status: boolean;
}
export interface IRoom {
    players: [IPlayer]
}