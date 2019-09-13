import { IPlayer } from '../rooms/RoomSystem';
import { IPlayerID } from '../players/IPlayer';

export enum EGameState {
    GAME_NOT_STARTED,
    GAME_LOBBY,
    GAME_PLAYING,
    GAME_ENDED
}

export interface IGame {
    id: string;
    players: IPlayer[];
    state: EGameState;

    /**
     * Sets the host player in the game
     * Assumes that the player already exists
     * @param player Sets the player for host
     */
    SetHostPlayer(player: IPlayerID): void;

    /**
     * Adds a player to the game or sets the status
     * @param player the player 
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