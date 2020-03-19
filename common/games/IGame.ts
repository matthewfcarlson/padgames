import { IRoom } from '../rooms/IRoom';
import { IPlayerID } from '../players/IPlayer';

export enum EGameState {
    GAME_NOT_STARTED,
    GAME_LOBBY,
    GAME_PLAYING,
    GAME_ENDED
}


export interface IGame {
    id: string;
    room: IRoom;
    state: EGameState;

    /**
     * Adds a player to the game or sets the status
     * @param player the player that we're setting the status of
     */
    SetPlayerStatus(player: IPlayerID): boolean;

    /**
     * Gets the current state of the game
     */
    GetGameState(): EGameState;

    /**
     * Returns whether the a player can join the game
     */
    CanJoinGame(): boolean;


}