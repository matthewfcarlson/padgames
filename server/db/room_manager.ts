// This manages all the rooms
import { ActionPacket, ActionSource, isActionExtraPayload, isActionSource, JwtUser, MutationPacket, RoomAdvert, RoomVisibility, SocketEvents, SocketUser } from "../../common/store_types";
import { CommonGameContext, CommonModule, SyncedGameActions, SyncedGameGetters, SyncedGameMutations, SyncedGameState } from "../../common/common_store";
import { DataBaseID, DbUser } from "./db_types";
import { DataBase } from "../db/db_types";
import http from "http";
import { createStore } from "../store/store";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GAME_NAME, KeeypStoreModule } from '../../common/keeyp2d_store';

export const MAX_PLAYERS = 6;

type SocketId = string;
export interface ServerRoom {
    gameCode: string
    player_count: number
    gameStarted: boolean
    expires: number // the timestamp that this expires at (UTC)
    visibility: RoomVisibility // if the game is private
    roomHost: JwtUser // the user that created this room
    gameState?: CommonGameContext;
}

const room_info = new Map<string, ServerRoom>();
// allows someone to lookup the games that are owned by a player by ID
const room_owner_lookup = new Map<number, string>();
const public_games: Set<string> = new Set(); // a list of all the public games

const server_user: SocketUser = {
    _id: 0,
    name: 'Server',
    socket_id: '',
    connected:true,
};

export function findNewGameCode(length?: number): string | null {
    if (length == null) length = 5;
    if (length > 6) return null;
    const characters = 'ABFHIJMOQRU234';
    // only 15^5 possible combos (759375)
    // 6 digit codes have 11390625 combos and we will go there once we are full
    const charactersLength = characters.length;
    let base_array = Array(length).fill('');
    const max_attempts = 50;
    let attempts = 0;
    while (attempts < max_attempts) {
        attempts += 1;
        let result = base_array.map((x) => characters.charAt(Math.floor(Math.random() * charactersLength))).join('');
        if (!room_info.has(result)) return result;
    }

    return findNewGameCode(length + 1);
}

let ioSocketCallback:any = null;
export function setIoSocketCallback(callback: any) {
    ioSocketCallback = callback;
}

export function createRoom(creator: JwtUser, visibility: RoomVisibility): RoomAdvert | null {
    const code = findNewGameCode();
    // TODO: check if the user already has a game that they are the owner of
    if (room_owner_lookup.has(creator._id)) {
        console.error("This user already has someone registered to them");
        return null;
    }
    if (creator.temporary) {
        console.error("A temporary account cannot create a room");
        return null;
    }
    if (code == null) return null;
    if (ioSocketCallback == null) return null;
    const room_socket = ioSocketCallback(code);
    const module = (KeeypStoreModule.clone() as any as CommonModule);
    const gameCallback = (room_socket) ? ((mutation: any, state: SyncedGameState, getters: SyncedGameGetters<SyncedGameState>) => {
        if (mutation.type.includes("Server")) return; // any mutation that has server in the name is skipped
        const stateHash = getters.stateHash * 1;
        console.log("SERVER MUTATION on ", code, JSON.stringify(mutation), stateHash);
        const packet: MutationPacket = {
            resultHash: stateHash,
            type: GAME_NAME + '/' + mutation.type,
            payload: mutation.payload
        }
        room_socket.emit(SocketEvents.SERVER_MUTATION, packet);
    }) : null;
    const gameState = createStore(module, gameCallback);
    gameState.mutations.setIsServer(true);

    // reset the store
    gameState.actions.reset(server_user);

    if (!room_info.has(code)) {
        // TODO: figure out expiration date
        room_info.set(code, { gameCode: code,gameStarted: false, player_count: 0, expires:0, visibility, roomHost:creator });
    }
    const room = room_info.get(code);
    if (room == null || room == undefined) return null;
    room.gameState = gameState;
    room_info.set(code, room);

    public_games.add(code);
    room_owner_lookup.set(creator._id, code);

    return {
        code,
        players_connected: 0,
        hosted_by: creator.name,
        public: visibility == RoomVisibility.PUBLIC
    };
}

export function requestVisibleGames(user: JwtUser): RoomAdvert[] {
    // gets a list of the games visible to a player and who they are hosted by?
    // TODO: get all the public games?
    function convertToAdvert(code: string, room: ServerRoom): RoomAdvert {
        return {
            players_connected: room.player_count,
            code,
            hosted_by: room.roomHost.name,
            public: room.visibility == RoomVisibility.PUBLIC,
        }
    }
    const public_adverts = Array.from(public_games.values()).map((x) => {
        const room = room_info.get(x);
        if (room == null) return null;
        return convertToAdvert(x, room);
    }).filter((x) => x != null);

    return public_adverts as any;
}

export function cleanupGames() {
    // deletes all the games that are past their expiration date
}

export function canPlayerJoin(user:JwtUser, code:string) {
    const room = room_info.get(code);
    if (room == null || room == undefined) return false;
    if (room.player_count >= MAX_PLAYERS) return false;
    if (room.gameStarted) {
        console.error(`ROOM ${code} has already started`)
        return false;
    }
    if (room.visibility != RoomVisibility.FRIENDS_ONLY) return true;
    // TODO: check if the player is friends or the creating player
    return false;
}

export function getGameState(code:string) {
    const room = room_info.get(code);
    if (room == null || room == undefined) return null;
    return room.gameState;
}

export function addPlayerToRoom(user:JwtUser, socket_id:string, code:string) {
    const new_connection:SocketUser = {
        _id: user._id,
        socket_id: socket_id,
        name: user.name,
        connected:true,
    };
    const room = room_info.get(code);
    if (room == null || room == undefined || room.gameState == undefined || room.gameState == null) return false;
    if (room.gameState.getters.players.length == 0) {
        room.roomHost = user;
    }
    room.gameState.mutations.addPlayer(new_connection);
    room.player_count = room.gameState.getters.players.length;

    return true;
}

export function removePlayerFromRoom(user:JwtUser, socket_id:string, code:string) {
    const new_connection:SocketUser = {
        _id: user._id,
        socket_id: socket_id,
        name: user.name,
        connected:false,
    };
    const room = room_info.get(code);
    if (room == null || room == undefined || room.gameState == undefined || room.gameState == null) return false;
    room.gameState.mutations.removePlayer(new_connection);
    room.player_count = Math.max(0, room.player_count -1);

    // change host if needed
    const old_host = room.roomHost;
    if (old_host._id == user._id ) {
        // create a new host
        const players = room.gameState.getters.players;
        if (players.length > 0) {
            // host is always the player that is in the zero slot
            const new_host = players[0];
            const new_host_data:JwtUser = {
                _id:new_host._id,
                name:new_host.name,
                temporary: old_host.temporary
            }
            room.roomHost = new_host_data;
        }
    }

    return true;
}

export function setPlayerConnectedStatusInRoom(user:JwtUser, socket_id:string, code:string, connected:boolean) {
    const new_connection:SocketUser = {
        _id: user._id,
        socket_id: socket_id,
        name: user.name,
        connected,
    };
    const room = room_info.get(code);
    if (room == null || room == undefined || room.gameState == undefined || room.gameState == null) return false;
    room.gameState.mutations.setPlayerConnected(new_connection);

    return true;
}