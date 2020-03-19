import { IRoom, RoomId, GameType } from "../../../common/rooms/IRoom";
import room_codes from "./room_codes";
import { RootLogger } from "../../../common/util/logger";
import { ServerRoom } from "./server_room";
import { AllGames } from "../../../games/games.dynamic";

// This handles all the room systems
// This also handles communication with other servers?
// Should this also handle player connections and disconnections?
// Should this have some sort of logging for events? When games are created, etc?

export default class RoomManager {

    // TODO figure how to do a map in typescript
    private roomStore: Map<RoomId, ServerRoom> = new Map();
    private gameUrlMap: Map<GameType, string> = new Map(); // A map that converts a game type to a url

    public constructor() {
        for (const item of AllGames) {
            this.gameUrlMap.set(item["id"], item["url"]);
        }
    }

    /**
     * Figures out if a given game ID already exists
     * @param id the room id
     */
    public DoesRoomExist(id: RoomId): boolean {
        // We should just check our internal store
        if (this.roomStore.has(id)) {
            return true;
        }
        return false;
    }

    private GetUnusedRoomId(): RoomId {
        let potentialRoomCodeIndex = -1;
        let iterationCount = 0;
        while (potentialRoomCodeIndex === -1 && iterationCount < 1000) {
            potentialRoomCodeIndex = Math.floor(Math.random() * room_codes.length);
            if (this.DoesRoomExist(room_codes[potentialRoomCodeIndex])) {
                potentialRoomCodeIndex = -1;
                // TODO figure out a better way to do this?
                // Start walking the tree?
                // ETC?
                // TODO: have a list of unused room codes?
            }
            iterationCount += 1;
        }
        if (potentialRoomCodeIndex === -1) {
            // This is an error case - not sure what to do here.
            RootLogger.error("Unable to generate a room ID");
            return "ERROR";
        }
        return room_codes[potentialRoomCodeIndex].toUpperCase();
    }


    /**
     * Creates a game of the game type on this server
     * This also notified other servers of this new room
     * @param game the type of game you want to play
     * @retval the id of the game that is created or null if we were unable to create one
     */
    public CreateNewRoom(game: GameType): RoomId | null {
        // Make sure this is a good type of phone
        if (!this.gameUrlMap.has(game)) {
            return null;
        }
        // Get an ID that isn't used
        const id = this.GetUnusedRoomId();
        // Create a new room of the type specified
        const room = new ServerRoom(game);
        // TODO: determine if this game is a valid game type?
        if (room == null) {
            // TODO: log error
            RootLogger.error("Failed to create room of type " + game + " for id " + id);
            return null;
        }
        // Store game
        this.roomStore.set(id, room);
        // Then returns a new room id
        // TODO log an event of some kind that Room has been created
        return id;
    }

    /**
     * This gets the room for that room ID
     * If this is a foriegn game and we haven't populated this yet, the details
     * will be requested from the other servers, so this make take a while in
     * some cases
     * @param id the room to get
     * @retval the room object if it exists or
     */
    public GetRoom(id: RoomId): ServerRoom | null {
        if (this.DoesRoomExist(id)) {
            return null;
        }
        return this.roomStore.get(id) || null;
    }

    /**
     * Gets the url for this particular room
     * @param id the room id
     * @returns the url to go to or null if the game doesn't exist
     */
    public GetRoomUrl(id: RoomId): string | null {
        const room = this.roomStore.get(id);
        if (room == null) {
            return null;
        }
        const type = room.GetGameType();
        RootLogger.info("Found room of type " + type);
        const urlBase = this.gameUrlMap.get(type);
        // How do I get the route for this?
        return urlBase + "/" + id;
    }

    /**
     * Removes the game specified from the listings
     * The game must have zero connected clients and exist
     * Sends out a notification to other servers to remove this game as well
     * @param id the room id
     */
    public RemoveGame(id: RoomId): boolean {
        // TODO implement
        return false;
    }

    /**
     * Returns an iterable of the current rooms known by this server
     */
    public GetCurrentRooms(): RoomId[] {
        return Array.from(this.roomStore.keys());
    }

    /**
     * Adds a reference that a game exists on a different server
     * @param id the room id
     * @param game the game id
     * @retval returns true if successfully added or false if something went wrong
     */
    private AddForiegnGame(id: RoomId, game: GameType): boolean {
        // Make sure we don't already know about this room
        if (this.DoesRoomExist(id)) {
            // TODO: throw an error or log and error
            return false;
        }
        // Create a new ServerRoom
        const room = new ServerRoom(game, true);
        // Mark it as foriegn
        // Mark it as not fleshed out
        this.roomStore.set(id, room);
        return true;
    }

    /**
     * Notify foriegn servers that a room has been created locally
     * @param id the room to notify of
     */
    private NotifyForiegnServers(id: RoomId): boolean {
        // TODO implement
        return false;
    }

    /**
     * Cleans out rooms that are no longer being used or have stuck around too long. This should be called semi often.
     * @retval the number of rooms that were cleaned out
     */
    private CleanRooms(): number {
        // TODO implement
        return 0;
    }
}