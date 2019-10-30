import { IPlayerID, IPlayer } from '../players/IPlayer';
import { IGame, EGameState } from '../games/IGame';


export type RoomId = string;
export type GameType = string;

export interface IRoom {
    /**
     * returns the id of the player that is currently the host
     */
    GetHostPlayer(): IPlayerID;

    GetGameState(): EGameState;
}