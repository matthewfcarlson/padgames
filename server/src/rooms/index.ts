// This is handles the room system, player joining and leaving, the host and join endpoints
// TODO: should this handle player ID's as well?

import RoomManager from "./room_manager";
import express from "express";
import socketio from "socket.io";
import { RootLogger } from "../../../common/util/logger";
import { nextTick } from "q";


// Create the singleton global variable
const gRoomManager = new RoomManager();
// Gets the singleton room manager
// TODO: research typescript singleton pattern
function GetRoomManager(): RoomManager {
    return gRoomManager;
}

function RoomHostMiddleware(request: express.Request, response: express.Response, next: any) {
    RootLogger.info("Host");
    next();
}

function RoomJoinMiddleware(request: express.Request, response: express.Response, next: any) {
    RootLogger.info("Join");
    next();
}

// This is the middleware that express uses to setup the
export function RoomManagerMiddleware(app: express.Express) {
    // setup the /join and /host options to do the appropiate things
    app.get("/host/:gameId", RoomHostMiddleware);
    app.get("/join/:roomId", RoomJoinMiddleware);
    // Also expose some testing endpoints if we are in dev mode?
}

/**
 * This setups the connections to handle players joining and leaving
 * @param io the socket io
 */
export function RoomManagerSocketware(io: socketio.Client) {
    
}