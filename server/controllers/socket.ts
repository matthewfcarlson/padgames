import { Server, Socket } from "socket.io";
import { ActionPacket, ActionSource, isActionExtraPayload, isActionSource, JwtUser, MutationPacket, SocketEvents, SocketUser } from "../../common/store_types";

import { DataBase } from "../db/db_types";
import { DecodeJwtToken } from "./auth";
import http from "http";
//import { createStore } from "../store/store";
//import { CommonGameContext, CommonModule, SyncedGameActions, SyncedGameGetters, SyncedGameMutations, SyncedGameState } from "../../common/common_store";
//import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { addPlayerToRoom, canPlayerJoin, getGameState, removePlayerFromRoom, setIoSocketCallback, setPlayerConnectedStatusInRoom } from "../db/room_manager";

type SocketId = string;
const socket_map = new Map<SocketId, JwtUser>();
// TODO: encoding expiration information in the user room map?
// Otherwise it will never get cleared
const user_room_map = new Map<number, string>();
const server_user:SocketUser = {
    _id: 0,
    name: 'Server',
    socket_id: '',
    connected: true,
};

type CommonGameContext = any;

export default function SetupWebsocket(server: http.Server, db: DataBase) {

    const io = new Server(server);
    console.log("WebSocket Initialized")

    setIoSocketCallback((code:string)=>io.to(code));

    io.on('connection', (socket) => {
        const token = socket.handshake.auth.token;
        let user = DecodeJwtToken(token);
        if (user == null) {
            console.error("Bad token from socket " + socket.id, token)
            return;
        }
        console.log('a user connected ' + socket.id + " " + user.name + ", " + user._id);
        socket_map.set(socket.id, user);

        // Check if we already think this user is joined to a game already?
        if (user_room_map.has(user._id)) {
            console.log(`attempting to rejoin ${user.name} to room`);
            const room_id = user_room_map.get(user._id);
            if (room_id == null || room_id == undefined) return;
            let gameState = getGameState(room_id);
            if (gameState == null) return;
            // let the user know they're in the room
            setPlayerConnectedStatusInRoom(user, socket.id, room_id, true);
            socket.emit(SocketEvents.JOIN_ROOM, room_id);
            // join the player to the socket
            socket.join(room_id);
            // TODO: check if the room has this player in it already?
            sendResyncPacket(socket, gameState);
            console.log(`rejoined ${user.name} to room`);
        }

        socket.on(SocketEvents.JOIN_ROOM, (room_id:string)=>{
            if (user == null) return;
            // TODO: sanitize input?
            console.log("Attempted to join room", room_id, user.name)
            const can_join = canPlayerJoin(user, room_id) && !user_room_map.has(user._id);
            if (!can_join) {
                console.log("Unable to join", room_id, user.name);
                return;
            }
            let gameState = getGameState(room_id);
            if (gameState == null) return;
            // let the user know they're in the room
            socket.emit(SocketEvents.JOIN_ROOM, room_id);
            // join the player to the socket
            socket.join(room_id);
            // Add the user to the room
            addPlayerToRoom(user, socket.id, room_id);
            // Resync them with everything that has happened so far
            sendResyncPacket(socket, gameState);
            user_room_map.set(user._id, room_id);
        });
        socket.on(SocketEvents.LEAVE_ROOM, ()=>{
            if (user == null) return;
            // TODO: sanitize input?
            console.log("USER LEAVING ROOM", user.name)
            const room_id = user_room_map.get(user._id);
            if (room_id == null || room_id == undefined) return;
            socket.leave(room_id);
            socket.emit(SocketEvents.LEAVE_ROOM);
            user_room_map.delete(user._id);
            // let other players know that the player has left
            removePlayerFromRoom(user, socket.id, room_id);
        });

        socket.on(SocketEvents.CLIENT_ACTION, (packet: ActionPacket) => {
            if (user == null) return;
            // TODO: how do I inject the correct user into the packet?
            const action_name = packet.type.split("/")[1];
            let payload = packet.payload;
            const source = {...user, socket_id:socket.id, connected:true} as ActionSource;
            if (!isActionSource(payload) && isActionExtraPayload(payload)) {
                payload.source = source;
            }
            else {
                payload = source;
            }
            console.log("Action from player "+ user.name +": " + action_name, JSON.stringify(packet.payload));
            const room_id = user_room_map.get(user._id);
            if (room_id == null || room_id == undefined) return;
            let gameState = getGameState(room_id);
            if (gameState != undefined && gameState != null) {
                gameState.dispatch(action_name as any, payload);
            }
        });

        socket.on(SocketEvents.GAME_SYNC, () => {
            // TODO: use our user lookup array
            let all_rooms = Array.from(socket.rooms.values());
            console.log("RESYNC", all_rooms);
            const rooms = all_rooms.filter(x=>x.length < 10);
            if (rooms.length != 1) return;
            const room_id = rooms[0];
            let gameState = getGameState(room_id);
            if (gameState == null) return;
            console.log("User requested resync packet " + socket.id, user?.name || 'unknown');
            sendResyncPacket(socket, gameState);
        });

        socket.on('reconnect', () => {
            if (user == null) return;
            console.log('user reconnected ' + socket.id + " " + user?.name || "");
            const code = user_room_map.get(user._id);
            // If we don't know where they're supposed to go?
            // TODO: some way to check what rooms they are in and make sure it matches what we expect
            if (code == null || code == undefined) return;

            // TODO tell them to leave the room if it no longer exists
            
        });

        socket.on('disconnect', () => {
            if (user == null) return;
            console.log('user disconnected ' + socket.id + " " + user?.name || "");
            const code = user_room_map.get(user._id);
            // TODO: how to tell when a player is gone for good?
            // Perhaps some sort of timeout?
            if (code == null || code == undefined) return;
            socket_map.delete(socket.id);
            setPlayerConnectedStatusInRoom(user, socket.id, code, false);
        });
    });
}
function sendResyncPacket(socket: Socket, gameState: CommonGameContext) {
    // TODO: we assume that there is only one game type here, should we make this work better?
    const packet: MutationPacket = {
        resultHash: gameState.getters.stateHash,
        //type: GAME_NAME + '/setState', // TODO: figure out what game we're playing?
        type: '/setState', // TODO: figure out what game we're playing?
        payload: gameState.state // TODO: implement a getter that gets the public state to only send what that player needs
    }
    socket.emit(SocketEvents.SERVER_MUTATION, packet);
}
