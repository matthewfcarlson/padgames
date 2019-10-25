import { IRoom, RoomId, GameType } from "../../../common/rooms/IRoom";

// This handles all the room systems
// This also handles communication with other servers?
// Should this also handle player connections and disconnections?
// Should this have some sort of logging for events? When games are created, etc?

export default class RoomManager {

    // TODO figure how to do a map in typescript
    private roomStore: Map<RoomId, IRoom> = new Map();

    /**
     * Figures out if a given game ID already exists
     * @param id
     */
    public DoesRoomExist(id: RoomId): boolean {
        // We should just check our internal store
        if (this.roomStore.has(id)) {
            return true;
        }
        return false;
    }

    /**
     * Creates a game of the game type on this server
     * This also notified other servers of this new room
     * @param game the type of game you want to play
     * @retval the id of the game that is created or null if we were unable to create one
     */
    public CreateNewRoom(game: GameType): RoomId | null {
        // Create a new room of the type specified
        // Then returns a new room id
        // TODO log an event of some kind
        return null;
    }

    /**
     * This gets the room for that room ID
     * If this is a foriegn game and we haven't populated this yet, the details
     * will be requested from the other servers, so this make take a while in
     * some cases
     * @param id the room to get
     * @retval the room object if it exists or
     */
    public GetRoom(id: RoomId): IRoom | null {
        return null;
    }

    /**
     * Removes the game specified from the listings
     * Sends out a notification to other servers to remove this game as well
     * @param id 
     */
    public RemoveGame(id: RoomId): boolean {
        return false;
    }

    /**
     * Returns an iterable of the current rooms known by this server
     */
    public GetCurrentRooms(): IterableIterator<RoomId> {
        return this.roomStore.keys();
    }

    /**
     * Adds a reference that a game exists on a different server
     * @param id 
     * @param game 
     * @retval returns true if successfully added or false if something went wrong
     */
    private AddForiegnGame(id: RoomId, game: GameType): boolean {
        // Make sure we don't already know about this room
        if (this.DoesRoomExist(id)) {
            // TODO: throw an error or log and error
            return false;
        }
        // Create a new ServerRoom
        // Mark it as foriegn
        // Mark it as not fleshed out
        return false;
    }

    /**
     * Cleans out rooms that are no longer being used or have stuck around too long. This should be called semi often.
     * @retval the number of rooms that were cleaned out
     */
    private CleanRooms(): number {
        return 0;
    }

}