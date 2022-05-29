import { Server, Socket } from "socket.io";
import { MatchupPhase, MatchupStoreModule, MatchupStoreState } from "../../common/matchup_store";
import { SloganStoreModule } from "../../common/slogan_store";
import { ActionPacket, ActionSource, GameTypes, isActionExtraPayload, isActionSource, JwtUser, MutationPacket, SocketEvents, SocketUser } from "../../common/types";
import { DataBase } from "../db/types";
import { DecodeJwtToken } from "./auth";
import http from "http";
import { createStore } from "../store/store";
import { CommonGameContext, CommonModule, SyncedGameActions, SyncedGameGetters, SyncedGameMutations, SyncedGameState } from "../../common/common_store";
import { DefaultEventsMap } from "socket.io/dist/typed-events";


type SocketId = string;
const socket_map = new Map<SocketId, JwtUser>();
interface ServerRoom {
    currentGame: string;
    connected_sockets: Set<SocketId>;
    groupId: number;
    gameStarted: boolean;
    gameState?: CommonGameContext;
}


const room_info = new Map<string, ServerRoom>();

function getRoomString(user: number | JwtUser): string {
    if (typeof (user) == "number") return "group" + user;
    return "group" + user.groupId;
}

function createGame(room:ServerRoom, game:string, room_socket?:any): CommonGameContext{
    if (GameTypes.indexOf(game) == -1){
        console.error("We don't support non matchup games yet");
        throw new Error("We don't support non matchup games");
    }
    const module = ((game == 'matchup')? MatchupStoreModule.clone(): SloganStoreModule.clone()) as any as CommonModule;
    const gameCallback = (room_socket) ? ((mutation:any, state:SyncedGameState, getters:SyncedGameGetters<SyncedGameState>) => {
        if (mutation.type.includes("Server")) return; // any mutation that has server in the name is skipped
        const stateHash = getters.stateHash * 1;
        console.log("SERVER MUTATION", mutation, stateHash);
        const packet: MutationPacket = {
            resultHash: stateHash,
            type: game + '/' + mutation.type,
            payload: mutation.payload
        }
        room_socket.emit(SocketEvents.SERVER_MUTATION, packet);
    }) : null;
    const gameState = createStore(module, gameCallback);
    gameState.mutations.setIsServer(true);
    
    // reset the store
    gameState.actions.reset({
        _id:0,
        name: 'Server',
        socket_id: '',
        isHost:true,
        isSpectator:true
    });
    // add all the players
    room.connected_sockets.forEach((x)=>{
        const player = socket_map.get(x);
        if (player == null) return;
        if (player.isHost || player.isSpectator) return;
        gameState.mutations.addPlayer({
            socket_id: x,
            _id: player._id,
            name: player.name,
            isHost:player.isHost,
            isSpectator: player.isSpectator
        });
    });
    
    return gameState;
}

export default function SetupWebsocket(server: http.Server, db: DataBase) {

    const io = new Server(server);

    io.on('connection', (socket) => {
        const token = socket.handshake.auth.token;
        let user = DecodeJwtToken(token);
        if (user == null) {
            console.error("Bad token from socket " + socket.id, token)
            return;
        }
        console.log('a user connected ' + socket.id + " "+ user.name + ", "+ user._id);
        socket_map.set(socket.id, user);
        const roomName = getRoomString(user);
        // Create the room if it doesn't exist
        if (!room_info.has(roomName)) {
            room_info.set(roomName, { currentGame: "", groupId: user.groupId, gameStarted: false, connected_sockets: new Set() });
        }
        // Add the user to the room
        {
            let room = room_info.get(roomName);
            if (room != undefined && user != null) {
                room.connected_sockets.add(socket.id);
                socket.emit(SocketEvents.SET_GAME, room.currentGame);
                if (room.gameState != undefined) {
                    const new_connection = {
                        _id: user._id,
                        socket_id: socket.id,
                        name: user.name,
                        isHost: user.isHost,
                        isSpectator: user.isSpectator,
                    };
                    // add the new connection to the game's list of users
                    if (!user.isHost && !user.isSpectator) room.gameState.mutations.addPlayer(new_connection);
                    console.log("Sending resync packet "+ socket.id, user.name);
                    sendResyncPacket(socket, room.gameState);
                }
            }
        }
        // Join the socket to the room
        socket.join(roomName);
        // Handle disconnections
        socket.on('disconnect', () => {
            console.log('user disconnected ' + socket.id + " " + user?.name || "");
            let room = room_info.get(roomName);
            if (room != undefined) {
                room.connected_sockets.delete(socket.id);
                const state = room.gameState;
                if (state != undefined) {
                    state.mutations.removePlayer({
                        _id: user?._id||-1,
                        socket_id: socket.id,
                        name: user?.name || '',
                        isHost: user?.isHost || false,
                        isSpectator: user?.isSpectator || false,
                    });
                }
                // TODO: check if the room is empty and delete it
            }
            socket_map.delete(socket.id);
        });
        // When an admin sets the game
        socket.on(SocketEvents.SET_GAME, (game: unknown) => {
            if (user == undefined) {
                console.error("User required");
                return;
            }
            if (!user.isHost) {
                console.error("Need to be admin");
                return;
            }
            if (typeof (game) != 'string') return;
            if (game != "" && GameTypes.indexOf(game) == -1) {
                console.error("Invalid game " + game);
                return;
            }
            // TODO check if the game name is valid
            // TODO set the room state
            io.to(roomName).emit(SocketEvents.SET_GAME, game);
            let room = room_info.get(roomName);
            if (room != undefined) {
                
                room.currentGame = game;
                delete room.gameState;
                // Get the correct module
                const gameState = createGame(room, game,io.to(roomName));
                room.gameState = gameState;
                room_info.set(roomName, room);
            }
        });
        socket.on(SocketEvents.CLIENT_ACTION, (packet: ActionPacket) => {
            if (user == null) return;
            // TODO: how do I inject the correct user into the packet?
            const action_name = packet.type.split("/")[1];
            let payload = packet.payload;
            const source = {...user, socket_id:socket.id} as ActionSource;
            if (!isActionSource(payload) && isActionExtraPayload(payload)) {
                payload.source = source;
            }
            else {
                payload = source;
            }
            console.log("Action from player "+ user.name +": " + action_name, packet.payload);

            let room = room_info.get(roomName);
            if (room != null && room.gameState != undefined) {
                room.gameState.dispatch(action_name as any, payload);
            }
        });

        socket.on(SocketEvents.GAME_SYNC, ()=> {
            let room = room_info.get(roomName);
            if (room == null || room.gameState == null) return;
            console.log("User requested resync packet "+ socket.id, user?.name||'unknown');
            sendResyncPacket(socket, room.gameState);
        });
    });
}
function sendResyncPacket(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, gameState: CommonGameContext) {
    const packet:MutationPacket = {
        resultHash: gameState.getters.stateHash,
        type: 'matchup/setState',
        payload: gameState.state // TODO: implement a getter that gets the public state to prevent cheating?
    }
    socket.emit(SocketEvents.SERVER_MUTATION, packet);
}
